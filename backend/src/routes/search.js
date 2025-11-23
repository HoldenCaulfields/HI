import express from 'express';
import { search, trending } from '../controllers/searchController.js';
import { authOptional } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authOptional, search);
router.get('/trending', trending);

export default router;