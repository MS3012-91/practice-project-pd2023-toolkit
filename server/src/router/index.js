const express = require('express');
const checkToken = require('../middlewares/checkToken');


const router = express.Router();

const userRouter = require('./userRoutes');
const contestRouter = require('./contestRouter');
const chatRouter = require('./chatRouters');
const offersRouter = require('./offersRouter');

router.use('/user', userRouter);
router.use('/contest', checkToken.checkToken, contestRouter);
router.use('/chat', checkToken.checkToken, chatRouter);
router.use('/offers', offersRouter);

module.exports = router;
