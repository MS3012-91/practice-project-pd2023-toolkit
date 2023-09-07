const { Router } = require('express');
const offersController = require('../controllers/offersController');

const offersRouter = Router();

offersRouter.get('/', offersController.getOffers);

module.exports = offersRouter;
