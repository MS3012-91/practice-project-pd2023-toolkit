const ServerError = require('../errors/ServerError');
const db = require('../models');

module.exports.getOffers = async (req, res, next) => {
  //pagination
  try {
    const foundOffers = await db.Offers.findAll({ raw: true });
    res.status(200).send(foundOffers);
  } catch (err) {
    next(new ServerError());
  }
};
