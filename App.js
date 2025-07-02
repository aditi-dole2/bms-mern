// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AddMovie  from './components/AddMovie';
import CreatePayment from './components/CreatePayment';
import GetAllUsers from './components/GetAllUsersAdmin';
import GetAllMovies from './components/GetAllMovies';
import GetAllMoviesAdmin from './components/GetAllMoviesAdmin';
import GetUserBookings from './components/GetUserBookings';
import BookingHistory from './components/BookingHistory';
import GetMovieById from './components/GetMovieById';
import Home from './components/Home';
import Login from './components/Login';
import NewBooking from './components/NewBooking';
import Signup from './components/Signup';
import Admin from './components/Admin';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { WalletProvider } from './components/WalletContext';
import Wallet from './components/Wallet';
import  SearchMovies  from './components/SearchMovies';
import  RecommendMovie  from './Recommender/App';
import  ScheduleMovies  from './components/ScheduleMovies';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AdminAnalytics from './components/AdminAnalytics';
const stripePromise = loadStripe('pk_test_51QzIIEK0OWqOyQnaZW8Bu9BKEqYJTZnmqp6pdDYvnY0135ItJuz2oKB3a9HDDsfx5K1IbQ2unGgQGkMUfAZtWJS900mcLBB89p');

const App = () => {
  return (

     <Elements stripe={stripePromise}>
      <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/addMovie" element={<AddMovie />} />
          <Route path="/createPayment" element={<CreatePayment />} />
          <Route path="/getAllMovies" element={<GetAllMovies />} />
          <Route path="/getAllMoviesAdmin" element={<GetAllMoviesAdmin />} />
          <Route path="/getAllUsers" element={<GetAllUsers />} />
          <Route path="/getBookingsofAnyUser/:userId" element={<GetUserBookings />} />
          <Route path="/bookingHistory" element={<BookingHistory />} />
          <Route path="/search" element={<GetMovieById />} />
          <Route path="/newBooking" element={<NewBooking />} />
          <Route path="/wallet" element={<Wallet userId={"someUserId"} />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/search/:title" element={<SearchMovies/>} />
          <Route path="/recommendMovie" element={<RecommendMovie/>} />
          <Route path="/scheduleMovies" element={<ScheduleMovies/>} />
          <Route path="/wallet" element={<Wallet userId={"someUserId"} />} />
          <Route path="/adminAnalytics" element={<AdminAnalytics />} />
        </Routes>
      </Router>
    </WalletProvider>
    </Elements>
  );
}

export default App;
