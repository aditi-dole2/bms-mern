import {React,useEffect, useState} from "react";
import { useNavigate,useParams } from "react-router-dom";
import Layout from "./Layout";
import { useWallet } from "./WalletContext";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';


export default function AdminDashboard() {
  const navigate = useNavigate();
  const { wallet, fetchWallet, loading, error, addFundsWithStripe, walletExists, createWallet } = useWallet();
  const userId = localStorage.getItem('userId'); // 👈 move here, make global for component
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');


  useEffect(() => {
    if (userId) {
      fetchWallet(userId);
    }
  }, [userId]); // dependency added

  const goToNewBooking = () => navigate("/newBooking");
  const goToAllBookings = () => navigate("/bookingHistory");
  const goToAllUsers = () => navigate("/getAllUsers");

  const handleAddMoneyClick = () => {
    setShowStripeForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowStripeForm(false);
    setAmount(0);
    setDescription('');
  };

  const handlePaymentError = (error) => {
    alert('Payment failed: ' + error.message);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Movie Management */}
        <div className="border rounded p-4 shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Manage Bookings</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={goToNewBooking}
              className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
            >
              ➕ New Booking
            </button>
            <button
              onClick={goToAllBookings}
              className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
            >
              🎬 View All Bookings
            </button>
          </div>
        </div>

        {/* User Management */}
         {/* Wallet Details */}
    <div className="border rounded p-4 shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Wallet Details</h2>
      {loading ? (
        <p>Loading wallet...</p>
      ) : error && !walletExists ? (
        <div>
          <p className="text-red-600">{error}</p>
          <button
            className="bg-green-600 text-black px-4 py-2 rounded mt-2"
            onClick={() => createWallet(userId)}
          >
            Create Wallet
          </button>
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          <p>Balance: {wallet ? wallet.balance : 0} Euros</p>
          {!showStripeForm ? (
            <>
              <input
                type="number"
                step="1"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button
                className="bg-blue-600 text-black px-4 py-2 rounded mt-2"
                onClick={handleAddMoneyClick}
              >
                Add Money
              </button>
            </>
          ) : (
            <Elements stripe={loadStripe('pk_test_51QzIIEK0OWqOyQnaZW8Bu9BKEqYJTZnmqp6pdDYvnY0135ItJuz2oKB3a9HDDsfx5K1IbQ2unGgQGkMUfAZtWJS900mcLBB89p')}>
              <StripePaymentForm
                userId={userId}
                amount={amount}
                description={description}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          )}
          <h3 className="mt-4 font-semibold">Recent Transactions:</h3>
          <ul>
            {wallet && wallet.transactions && wallet.transactions.length > 0 ? (
              wallet.transactions.slice(-5).reverse().map((tx, index) => (
                <li key={index}>
                  {tx.type} {tx.amount} on {new Date(tx.date).toLocaleDateString()} - {tx.description}
                </li>
              ))
            ) : (
              <li>No transactions found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
        
      </div>
    </Layout>
  );
}

const StripePaymentForm = ({ userId, amount, description, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const { fetchWallet } = useWallet();  // get fetchWallet from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      onError({ message: 'Stripe has not loaded' });
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError({ message: 'Card element not found' });
      return;
    }
    setLoading(true);
    try {
      // Create payment intent
      const paymentIntentRes = await axios.post('http://localhost:5000/wallet/create-payment-intent', { amount }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      console.log("paymentIntentRes",paymentIntentRes)
      const clientSecret = paymentIntentRes.data.clientSecret;

      // Confirm card payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (paymentResult.error) {
        console.log(paymentResult.error.message)
        throw new Error(paymentResult.error.message);
      }
      console.log("paymentRResult", paymentResult)

      if (paymentResult.paymentIntent.status === 'succeeded') {
        // Confirm top-up on backend
        await axios.post('http://localhost:5000/wallet/confirm-topup', { amount, description }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });

        // Optionally refresh wallet data here or in onSuccess
        await fetchWallet(userId);
        setError(null);
        console.log("confirmtopup ok")
      } else {
        console.log("payment error after payment intent")
        throw new Error('Payment not successful');
      }
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay ${amount} EUR`}
      </button>
    </form>
  );
};
