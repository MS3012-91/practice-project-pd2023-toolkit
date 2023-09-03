const { Conversation, Message, Catalog } = require('../models/mongoModels/');
const moment = require('moment');
const db = require('../models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const _ = require('lodash');

module.exports.addMessage = async (req, res, next) => {
  const {
    userId: senderId,
    firstName,
    lastName,
    displayName,
    avatar,
    email,
  } = req.tokenData;
  const { recipient, messageBody, interlocutor } = req.body;
  const participants = [senderId, recipient].sort((a, b) => a - b);
  const conversationDefault = {
    participants,
    blackList: [false, false],
    favoriteList: [false, false],
  };

  try {
    const newConversation = await Conversation.findOneAndUpdate(
      { participants },
      { conversationDefault },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      }
    );
    const interlocutorId = participants.filter(
      (participant) => participant !== senderId
    )[0];

    //сохраняем сообщение в БД
    const message = new Message({
      sender: senderId,
      body: messageBody,
      conversation: newConversation._id,
    });
    await message.save();

    const preview = {
      _id: newConversation._id,
      sender: senderId,
      text: messageBody,
      createAt: message.createdAt,
      participants,
      blackList: newConversation.blackList,
      favoriteList: newConversation.favoriteList,
    };
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview,
      interlocutor: {
        id: senderId,
        firstName,
        lastName,
        displayName,
        avatar,
        email,
      },
    });
    res.send({
      message,
      preview: Object.assign(preview, { interlocutor }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const userId = req.tokenData.userId;

  // находим все беседы, где участвует текущий пользователь
  try {
    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: { $elemMatch: { $eq: userId } },
        },
      },
      {
        $project: {
          _id: 1,
          participants: 1,
        },
      },
    ]);

    //пушим в массив
    const conversationAll = conversations.map((conv) => conv);

    //делаем действия для каждой беседы
    conversationAll.forEach(async (conv) => {
      const currentConversationId = conv._id;

      //получаем текущую беседу
      const currentConversation = conversations;

      //получем сообщения из текущей беседы
      const messages = await Message.aggregate([
        {
          $match: {
            conversation: currentConversationId,
          },
        },
        {
          $lookup: {
            from: 'conversations',
            localField: 'conversation',
            foreignField: '_id',
            as: 'conversationData',
          },
        },
        { $sort: { createdAt: 1 } },
        {
          $project: {
            _id: 1,
            sender: 1,
            body: 1,
            conversation: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);


      //получаем собеседников
      const currentinterlocutor = conv.participants.filter(
        (participant) => participant !== userId
      )[0];

      //получаем данные каждого собеседника
      try {
        const interlocutorData = await db.Users.findOne({
          where: {
            id: currentinterlocutor,
          },
        });
        if (!interlocutorData) {
          res.status(404).send('Interlocutor not found');
          return;
        }
        res.status(200).send({
          messages,
          interlocutor: {
            firstName: interlocutorData.firstName,
            lastName: interlocutorData.lastName,
            displayName: interlocutorData.displayName,
            id: interlocutorData.id,
            avatar: interlocutorData.avatar,
          },
        });
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const conversations = await Message.aggregate([
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversationData',
        },
      },
      {
        $unwind: '$conversationData',
      },
      {
        $match: {
          'conversationData.participants': req.tokenData.userId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: '$conversationData._id',
          sender: { $first: '$sender' },
          text: { $first: '$body' },
          createAt: { $first: '$createdAt' },
          participants: { $first: '$conversationData.participants' },
          blackList: { $first: '$conversationData.blackList' },
          favoriteList: { $first: '$conversationData.favoriteList' },
        },
      },
    ]);
    const interlocutors = [];
    conversations.forEach((conversation) => {
      interlocutors.push(
        conversation.participants.find(
          (participant) => participant !== req.tokenData.userId
        )
      );
    });
    const senders = await db.Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    conversations.forEach((conversation) => {
      senders.forEach((sender) => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });
    res.send(conversations);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const predicate =
    'blackList.' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [predicate]: req.body.blackListFlag } },
      { new: true }
    );
    res.send(chat);
    const interlocutorId = req.body.participants.filter(
      (participant) => participant !== req.tokenData.userId
    )[0];
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const predicate =
    'favoriteList.' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [predicate]: req.body.favoriteFlag } },
      { new: true }
    );
    res.send(chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const catalog = new Catalog({
    userId: req.tokenData.userId,
    catalogName: req.body.catalogName,
    chats: [req.body.chatId],
  });
  try {
    await catalog.save();
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { catalogName: req.body.catalogName },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { $addToSet: { chats: req.body.chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { $pull: { chats: req.body.chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await Catalog.remove({
      _id: req.body.catalogId,
      userId: req.tokenData.userId,
    });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalog.aggregate([
      { $match: { userId: req.tokenData.userId } },
      {
        $project: {
          _id: 1,
          catalogName: 1,
          chats: 1,
        },
      },
    ]);
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};
