import Wallet from '../models/Wallet.js';
import Stripe from 'stripe';

export const reachWallet = async (req, res,next) => {
    req.userId
    console.log("reached wallet",req.userId);
}

export const createWallet = async (req, res, next) => {
  try {
    //console.log("reached create wallet",req.userId);
    
    if (!req.userId) {
        console.log(req.userId);
      return res.status(400).json({ message: 'wallet : User ID is required' });
    }
    const userId = req.userId;
    console.log(userId)
    // Check if wallet already exists for user
    const existingWallet = await Wallet.findOne({userId });
    console.log("existing wallet",existingWallet)
    if (existingWallet) {
        console.log("Wallet already exists for this user")
      return res.status(400).json({ message: 'Wallet already exists for this user' });
    }
    const wallet = new Wallet({ userId, balance: 0, transactions: [] });
    await wallet.save();
    res.status(201).json(wallet);
    console.log("wallet created")
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating wallet', error: error.message });
  }
};

export const getWalletBalance = async (req, res,next) => {
  
  try {
    const  userId  = req.userId;
    console.log("at get wallet balance",userId);
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.json({ balance: wallet.balance, transactions: wallet.transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet balance', error: error.message });
  }
};

export const addFunds = async (req, res) => {
  try {
    const userId = req.userId;
    const {  amount, description } = req.body;
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid userId and positive amount are required' });
    }
    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    wallet.balance += amount;
    wallet.transactions.push({
      amount,
      type: 'credit',
      description: description || 'Added funds',
    });
    await wallet.save();
    res.json({ balance: wallet.balance });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error adding funds', error: error.message });
  }
};

// controllers/walletController.js

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const userId = req.userId;
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: 'eur',
      metadata: { integration_check: 'wallet_topup',  userId: userId || 'unknown' },
      payment_method_types: ['card'],
    });
    console.log('Payment intent', paymentIntent);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log('Stripe Error:', error);
    console.error('Stripe Error:', error);
    res.status(500).json({ message: 'Stripe error', error: error.message });
  }
};

export const confirmTopUp = async (req, res) => {
  console.log("at confirm topup")
  try {
    const userId = req.userId;
    const { amount, description } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    wallet.balance = Number(wallet.balance) + Number(amount);

    wallet.transactions.push({
      amount,
      type: 'credit',
      description: description || 'Stripe top-up',
    });

    await wallet.save();
    console.log("funds added", wallet.balance)
    res.json({ message: 'Funds added', balance: wallet.balance });
  } catch (error) {
    console.log("Error confirming top-up",error)
    res.status(500).json({ message: 'Error confirming top-up', error: error.message });
  }
};

export const deductFunds = async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid userId and positive amount are required' });
    }
    const wallet = await Wallet.findOne({ userId: userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: 'debit',
      description: description || 'Deducted funds',
    });
    await wallet.save();
    res.json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error deducting funds', error: error.message });
  }
};
