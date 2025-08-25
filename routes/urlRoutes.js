import express from 'express';
import { getAllList, redirect, shorten } from '../controllers/urlControllers.js';

const router = express.Router();

router.post('/shorten', shorten)
router.get('/admin/urls', getAllList);
router.get('/:code', redirect);

export default router;