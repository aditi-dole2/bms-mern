import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const LandingPage = () => {
  return (
    <Layout>
      <div className="landing-page-container d-flex flex-column align-items-center justify-content-center text-center p-5">
        <h1 className="mb-4 text-success">🎉 Booking Confirmed!</h1>
        <p className="lead mb-4">Thank you for your purchase. Your tickets have been booked successfully. Show your email confirmation.</p>
        

        <div className="button-group">
          <Link to="/userDashboard" className="btn btn-primary me-2">Go to Dashboard</Link>
          <Link to="/" className="btn btn-outline-secondary">Back to Home</Link>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;
