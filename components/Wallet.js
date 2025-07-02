import React, { useState, useEffect } from 'react';
import { useWallet } from './WalletContext';

// Import Stripe.js and Elements
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your Stripe publishable key

// New component for Stripe payment form
const StripePaymentForm = ({ userId, amount, description, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { addFundsWithStripe } = useWallet();
  useEffect(() => {
  console.log('[StripePaymentForm] Mounted');
  console.log('stripe:', stripe);
  console.log('elements:', elements);
  console.log("card",elements.getElement('card'));
}, [stripe, elements]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    // Pass stripe and elements to addFundsWithStripe for payment confirmation

    try {
      await addFundsWithStripe(userId, amount, description, stripe, elements.getElement('card'));
      onSuccess();
    } catch (error) {
      console.log(error);
      onError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay {amount} EUR
      </button>
    </form>
  );
};

const Wallet = ({ userId }) => {
  const { wallet, loading, error, fetchWallet, deductFunds } = useWallet();
  const [amount, setAmount] = useState('0');
  const [description, setDescription] = useState('');
  const [action, setAction] = useState('add'); // 'add' or 'deduct'
  const [showStripeForm, setShowStripeForm] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchWallet(userId);
    }
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }
    if (action === 'add') {
      // Show Stripe payment form instead of direct addFunds call
      setShowStripeForm(true);
    } else {
      deductFunds(userId, amt, description);
    }
  };

  const handlePaymentSuccess = () => {
    setShowStripeForm(false);
    setAmount('');
    setDescription('');
  };

  const handlePaymentError = (error) => {
    alert('Payment failed: ' + error.message);
  };

  return (
    <div>
      <h2>Wallet Balance in cents: {loading ? 'Loading...' : wallet ? wallet.balance : 0}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!showStripeForm ? (
        <form onSubmit={handleSubmit}>
          <label>
            Amount:
            <input
              type="number"
              step="5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <br />
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <br />
          <label>
            Action:
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="add">Add Funds</option>
              <option value="deduct">Deduct Funds</option>
            </select>
          </label>
          <br />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      ) : (
        
          <StripePaymentForm
            userId={userId}
            amount={parseFloat(amount)}
            description={description}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        
      )}
    </div>
  );
};

export default Wallet;
