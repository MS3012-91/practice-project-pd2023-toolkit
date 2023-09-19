const { Router } = require('express');
const offersController = require('../controllers/offersController');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const contestController = require('../controllers/contestController');


const offersRouter = Router();

offersRouter.get('/', offersController.getOffers);
offersRouter.post(
  '/setNewOffer',
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer
);

module.exports = offersRouter;
