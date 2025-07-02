import React, { useState } from 'react';
import LayoutAdmin from './LayoutAdmin';
import "../style/Login.css"

const Login = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle the form submission
    const handleLogin = async (event) => {
        event.preventDefault(); 

        // Send the email and password to the backend
        try {
            const response = await fetch('http://localhost:5000/admin/adminLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); // Parse the JSON response

            if (response.ok) {
                // If login is successful, store the token and redirect
                alert('Login successful!');
                localStorage.setItem('authToken', data.token); // Store the token in local storage
                window.location.href= '/dashboard'; // Redirect to the booking page
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
        <LayoutAdmin>
         <div className="login-container">
                <header className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Admin access</p>
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
                    </form>
                    
                    {/* Display error message if any */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </section>
            </div>
        </LayoutAdmin>
    );
};

export default Login;
