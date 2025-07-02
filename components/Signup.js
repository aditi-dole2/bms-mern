import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "./Layout";
import '../style/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! OTP sent to your email.");
        setOtpSent(true);
      } else {
        setErrorMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  const sendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to your email");
        setOtpSent(true);
      } else {
        alert("Failed to send OTP: " + data.message);
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        navigate("/login");
      } else {
        alert("OTP verification failed: " + data.message);
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="signup-container">
        <header className="signup-header">
          <h1>Join Movie Magic</h1>
          <p>Create your account to start booking tickets</p>
        </header>

        <section>
          {!otpSent && (
            <form id="signup-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="mobileNumber">Mobile</label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Enter your mobile"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              
          

              <button type="submit">Create Account</button>
            </form>
          )}
          {otpSent && !otpVerified && (
            <div className="otp-verification">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button onClick={verifyOtp}>Verify OTP</button>
            </div>
          )}


          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="login-prompt">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Signup;
