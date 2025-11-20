import express from 'express';
import  { search, trending } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', search);
router.get('/trending', trending);

export default router;