import { Router } from 'express';

const router = Router();

router.use('/log', require('./log'));
router.use('/event', require('./event'));
router.use('/progress', require('./progress'));

module.exports = router;
