import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletExists, setWalletExists] = useState(false);
 
  
  
  
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Adjust based on your app's auth storage
    if (userId) {
      fetchWallet(userId);
    }
  }, []);

  const fetchWallet = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/wallet/balance/${userId}`,
        {headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }}
    );
      if (response.data && typeof response.data.balance !== 'undefined') {
        setWallet({ balance: response.data.balance, transactions: response.data.transactions || [] });
        setWalletExists(true);
      } else {
        setWallet(null);
        setWalletExists(false);
      }
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setWallet(null);
        setWalletExists(false);
        setError('No wallet created');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/wallet/create', { userId }, {headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }});
      setWallet(response.data);
      setWalletExists(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const addFunds = async (userId, amount, description) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/wallet/addFunds', { userId, amount, description }, {headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }});
      // Refresh wallet data after adding funds
      await fetchWallet(userId);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };
    // New function to handle Stripe payment flow for adding funds
const addFundsWithStripe = async (userId, amount, description, stripe, cardElement) => {
  console.log("cardElement", cardElement)
  setLoading(true);
  try {
    // Create payment intent on backend
    const paymentIntentRes = await axios.post('http://localhost:5000/wallet/create-payment-intent', { amount }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    });

    const clientSecret = paymentIntentRes.data.clientSecret;
    // Confirm card payment using Stripe.js
    
  
    console.log("clientSecret", clientSecret)
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement
  } 
});

console.log("paymentResult",paymentResult)
console.log("paymentResult status",paymentResult.status)
    if (paymentResult.error) {
      throw new Error(paymentResult.error.message);
    }

    if (paymentResult.paymentIntent.status === 'succeeded') {
      // After successful payment, confirm top-up on backend
      await axios.post('http://localhost:5000/wallet/confirm-topup', { amount, description }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      // Refresh wallet data
      await fetchWallet(userId);
      setError(null);
    } else {

      throw new Error('Payment not successful');
    }
  } catch (err) {
    console.log(err);
    setError(err.message || 'Failed to add funds with Stripe');
    throw err;
  } finally {
    setLoading(false);
  }
};


  const deductFunds = async (userId, amount, description) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/wallet/deductFunds', { userId, amount, description }, {headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }});
      // Refresh wallet data after deducting funds
      await fetchWallet(userId);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deduct funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, loading, error, walletExists, addFundsWithStripe,fetchWallet, createWallet, addFunds, deductFunds }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
