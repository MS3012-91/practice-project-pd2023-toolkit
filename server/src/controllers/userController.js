const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const db = require('../models');
const { Op } = require('sequelize');
const NotUniqueEmail = require('../errors/NotUniqueEmail');
const moment = require('moment');
const { v4: uuid } = require('uuid');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');

module.exports.login = async (req, res, next) => {
  try {
    const foundUser = await userQueries.findUser({ email: req.body.email });
    await userQueries.passwordCompare(req.body.password, foundUser.password);
    const accessToken = jwt.sign(
      {
        firstName: foundUser.firstName,
        userId: foundUser.id,
        role: foundUser.role,
        lastName: foundUser.lastName,
        avatar: foundUser.avatar,
        displayName: foundUser.displayName,
        balance: foundUser.balance,
        email: foundUser.email,
        rating: foundUser.rating,
      },
      CONSTANTS.JWT_SECRET,
      { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
    );
    await userQueries.updateUser({ accessToken }, foundUser.id);
    res.send({ token: accessToken });
  } catch (err) {
    next(err);
  }
};
module.exports.registration = async (req, res, next) => {
  try {
    const newUser = await userQueries.userCreation(
      Object.assign(req.body, { password: req.hashPass })
    );
    const accessToken = jwt.sign(
      {
        firstName: newUser.firstName,
        userId: newUser.id,
        role: newUser.role,
        lastName: newUser.lastName,
        avatar: newUser.avatar,
        displayName: newUser.displayName,
        balance: newUser.balance,
        email: newUser.email,
        rating: newUser.rating,
      },
      CONSTANTS.JWT_SECRET,
      { expiresIn: CONSTANTS.ACCESS_TOKEN_TIME }
    );
    await userQueries.updateUser({ accessToken }, newUser.id);
    res.send({ token: accessToken });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      next(new NotUniqueEmail());
    } else {
      next(err);
    }
  }
};

function getQuery(offerId, userId, mark, isFirst, transaction) {
  const getCreateQuery = () =>
    ratingQueries.createRating(
      {
        offerId,
        mark,
        userId,
      },
      transaction
    );
  const getUpdateQuery = () =>
    ratingQueries.updateRating({ mark }, { offerId, userId }, transaction);
  return isFirst ? getCreateQuery : getUpdateQuery;
}

module.exports.changeMark = async (req, res, next) => {
  let sum = 0;
  let avg = 0;
  let transaction;
  const { isFirst, offerId, mark, creatorId } = req.body;
  const userId = req.tokenData.userId;
  try {
    transaction = await db.sequelize.transaction({
      isolationLevel:
        db.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });
    const query = getQuery(offerId, userId, mark, isFirst, transaction);
    await query();
    const offersArray = await db.Ratings.findAll({
      include: [
        {
          model: db.Offers,
          required: true,
          where: { userId: creatorId },
        },
      ],
      transaction,
    });
    for (let i = 0; i < offersArray.length; i++) {
      sum += offersArray[i].dataValues.mark;
    }
    avg = sum / offersArray.length;

    await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    transaction.commit();
    controller.getNotificationController().emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.payment = async (req, res, next) => {
  const {
    body: { expiry, number, cvc, price, contests },
    tokenData: { userId },
  } = req;
  const {
    SQUADHELP_BANK_NUMBER,
    SQUADHELP_BANK_CVC,
    SQUADHELP_BANK_EXPIRY,
    TRANSACTION_OPERATION_TYPES: { EXPENSE },
  } = CONSTANTS;
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    await bankQueries.updateBankBalance(
      {
        balance: db.sequelize.literal(`
          CASE
            WHEN "cardNumber"='${number.replace(/ /g, '')}' 
            AND "cvc"='${cvc}' 
            AND "expiry"='${expiry}'
                THEN "balance"-${price}
            WHEN "cardNumber"='${SQUADHELP_BANK_NUMBER}' 
            AND "cvc"='${SQUADHELP_BANK_CVC}' 
            AND "expiry"='${SQUADHELP_BANK_EXPIRY}'
                THEN "balance"+${price} END
        `),
      },
      {
        cardNumber: {
          [db.Sequelize.Op.in]: [
            SQUADHELP_BANK_NUMBER,
            number.replace(/ /g, ''),
          ],
        },
      },
      transaction
    );
    const orderId = uuid();
    req.body.contests.forEach((contest, index) => {
      const prize =
        index === contests.length - 1
          ? Math.ceil(price / contests.length)
          : Math.floor(price / contests.length);
      contest = Object.assign(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize,
      });

      //add bank transactions
    });
    await db.Contests.bulkCreate(req.body.contests, { transaction });
    const newCustomerTransaction = {
      amount: price,
      userId,
      operationType: EXPENSE,
    };
    await db.Transactions.create(newCustomerTransaction, { transaction });
    transaction.commit();
    res.send();
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.filename;
    }
    const updatedUser = await userQueries.updateUser(
      req.body,
      req.tokenData.userId
    );
    res.send({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      displayName: updatedUser.displayName,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      balance: updatedUser.balance,
      role: updatedUser.role,
      id: updatedUser.id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  const {
    body: { sum, number, expiry, cvc },
    tokenData: { userId },
  } = req;
  const {
    SQUADHELP_BANK_NUMBER,
    SQUADHELP_BANK_CVC,
    SQUADHELP_BANK_EXPIRY,
    TRANSACTION_OPERATION_TYPES: { INCOME },
  } = CONSTANTS;
  let transaction;
  try {
    transaction = await db.sequelize.transaction();
    const updatedUser = await userQueries.updateUser(
      { balance: db.sequelize.literal('balance - ' + sum) },
      userId,
      transaction
    );
    await bankQueries.updateBankBalance(
      {
        balance: db.sequelize.literal(`CASE 
        WHEN "cardNumber"='${number.replace(/ /g, '')}' 
          AND "expiry"='${expiry}' 
          AND "cvc"='${cvc}'
        THEN "balance"+${sum}
          WHEN "cardNumber"='${SQUADHELP_BANK_NUMBER}' 
          AND "expiry"='${SQUADHELP_BANK_EXPIRY}' 
          AND "cvc"='${SQUADHELP_BANK_CVC}'
        THEN "balance"-${sum}
          END`),
      },
      {
        cardNumber: {
          [db.Sequelize.Op.in]: [
            SQUADHELP_BANK_NUMBER,
            number.replace(/ /g, ''),
          ],
        },
      },
      transaction
    );
    // add bank transaction
    const newCreatorTransactions = {
      userId,
      amount: sum,
      operationType: INCOME,
    };
    await db.Transactions.create(newCreatorTransactions, { transaction });
    transaction.commit();
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.getTransactions = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { requestData } = req.query;
  // if (!newTransactionsOnPageCount) newTransactionsOnPageCount = 2;
  //const page = parseInt(req.page);
  console.log('limit', requestData);
  try {
    const user = await db.Users.findOne({
      raw: true,
      where: { id: userId },
      attributes: ['displayName'],
    });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const userName = user.displayName;
    const countFoundTransactions = await db.Transactions.count({
      raw: true,
      where: { userId },
      attributes: { exclude: ['updatedAt'] },
    });
    if (!countFoundTransactions) {
      return res.status(404).send('No transactions');
    }
    console.log('countfoundTransactions', countFoundTransactions);
    const foundTransactions = await db.Transactions.findAll({
      raw: true,
      where: { userId },
      limit: requestData,
      attributes: { exclude: ['updatedAt'] },
    });
    if (!foundTransactions) {
      return res.status(404).send('No transactions');
    }
    const countPages = Math.ceil(countFoundTransactions / requestData);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const sumOfExpenses = await db.Transactions.sum('amount', {
      where: {
        operationType: 'EXPENSE',
        createdAt: {
          [Op.gte]: threeDaysAgo,
        },
      },
    });
    res.status(200).send({ foundTransactions, countPages, userName, sumOfExpenses });
  } catch (err) {
    next(err);
  }
};
