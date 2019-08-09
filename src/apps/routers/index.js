import { Router } from 'express';

const router = Router();

router.use('/log', require('./log'));
router.use('/event', require('./event'));
router.use('/progress', require('./progress'));
router.use('/login', require('./user'));
router.use('/issac', require('./issac'));

module.exports = router;
