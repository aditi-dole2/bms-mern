
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import '../style/Login.css';

const Login = () => {
    // Define state variables for email, password, and error
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            navigate('/userDashboard');
        }
    }, [navigate]);

    // Handle the form submission
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Send the email and password to the backend
        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); // Parse the JSON response
            console.log(data)

            if (response.ok) {
                // If login is successful, store the token and redirect
                alert('Login successful!');
                localStorage.setItem("userId", data.id); // or whatever key holds the ID
                localStorage.setItem('authToken', data.token); // Store the token in local storage
                window.location.href= 'userDashboard'; // Redirect to the booking page
            } else {
                // If there's an error, show the error message
                setErrorMessage(`Error: ${data.message}`);
                window.location.href = ''; // Redirect to the homepage
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <Layout>
            <div className="login-container">
                <header className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Login to access your movie tickets</p>
                </header>

                {/* Login Form */}
                <section id="auth">
                    <form id="login-form" onSubmit={handleLogin}>
                        <label htmlFor="login-email">Email</label>
                        <input
                            type="email"
                            id="login-email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state
                            required
                        />

                        <label htmlFor="login-password">Password</label>
                        <input
                            type="password"
                            id="login-password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update password state
                            required
                        />

                        <button type="submit">Login</button>
                        <Link to="/admin" className="admin-login-link">Admin Login</Link>
                    </form>
                    
                    {/* Display error message if any */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    
                    <div className="register-prompt">
                        Don't have an account? <Link to="/signup">Sign up now</Link>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Login;