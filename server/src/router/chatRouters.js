const { Router } = require('express');
const chatController = require('../controllers/chatController');

const chatRouter = Router();

chatRouter.post('/newMessage', chatController.addMessage);

//get
chatRouter.get('/getChat', chatController.getChat);

//get
chatRouter.post('/getPreview', chatController.getPreview);

//get+post+del
chatRouter.post('/blackList', chatController.blackList);
//get+post+del
chatRouter.post('/favorite', chatController.favoriteChat);

//get+post+del
chatRouter.post('/createCatalog', chatController.createCatalog);
//update
chatRouter.post('/updateNameCatalog', chatController.updateNameCatalog);
//update
chatRouter.post('/addNewChatToCatalog', chatController.addNewChatToCatalog);
//update
chatRouter.post('/removeChatFromCatalog', chatController.removeChatFromCatalog);
//delete
chatRouter.post('/deleteCatalog', chatController.deleteCatalog);
//get
chatRouter.post('/getCatalogs', chatController.getCatalogs);

module.exports = chatRouter;


