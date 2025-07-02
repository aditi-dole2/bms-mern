import express from 'express';
import {createWallet, getWalletBalance, addFunds, deductFunds, reachWallet,confirmTopUp, createPaymentIntent } from '../controllers/wallet-controller.js';
import { authenticateUser,verifyAdmin } from "../services/user-middleware.js";

const router = express.Router();

router.get('/', authenticateUser,reachWallet);
router.post('/create',authenticateUser, createWallet);
router.get('/balance/:userId', authenticateUser, getWalletBalance);
router.post('/addFunds', authenticateUser,addFunds);
router.post('/deductFunds', authenticateUser, deductFunds);
router.post('/create-payment-intent', authenticateUser, createPaymentIntent);
router.post('/confirm-topup', authenticateUser, confirmTopUp);

export default router;
