const { Router } = require('express');
const {queryParser} = require('../middlewares/queryParser');
const contestController = require('../controllers/contestController');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');

const contestRouter = Router();

//GET /users/id/contests || contests&user=id ++++
contestRouter.get(
  '/byCustomer',
  queryParser,
  contestController.getCustomersContests
);

// GET contest/data
contestRouter.post(
  '/dataForContest',
  contestController.dataForContest
);

//GET /contest/
contestRouter.get(
  '/getAllContests',
  basicMiddlewares.onlyForCreative,
  contestController.getAllContests
);
//GET /contest/:id
contestRouter.get(
  '/:contestId',
  basicMiddlewares.canGetContest,
  contestController.getContestById
);
// POST /contest/:id
contestRouter.get(
  '/downloadFile/:fileName',
  contestController.downloadFile
);
// PATCH /contest/:id
contestRouter.post(
  '/updateContest',
  upload.updateContestFile,
  contestController.updateContest
);
//POST /contest/
contestRouter.post(
  '/setNewOffer',
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer
);
//PATCH contest/:id
contestRouter.post(
  '/setOfferStatus',
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus
);

module.exports = contestRouter;