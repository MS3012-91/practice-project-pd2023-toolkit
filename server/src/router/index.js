const express = require('express');
const router = express.Router();

const userRouter = require('./userRoutes');
const contestRouter = require('./contestRouter');
const chatRouter = require('./chatRouters');

router.use('/user', userRouter);
router.use('/contest', contestRouter);
router.use('/chat', chatRouter);

module.exports = router;
