import { Router } from 'express';
import log_router from './log';

const router = Router();

router.use('/log', log_router);

module.exports = router;
