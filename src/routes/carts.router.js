import { Router } from 'express';
import CartsManager from '../CartsManager.js';

const router = Router();
const manager = new CartsManager();

router.get('/', async (req, res) => {
});

export default router;