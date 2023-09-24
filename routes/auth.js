import express from 'express';
const router = express.Router();

import { login, register, requestResetPassword, resetPassword } from '../controllers/auth.js';

router.post('/register', register);
router.post('/login', login);
router.route('/reset-password').post(requestResetPassword).patch(resetPassword);

export default router;