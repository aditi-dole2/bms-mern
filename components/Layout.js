import React from 'react';
import { Link } from 'react-router-dom';
import useLogout from './Logout';
import "../style/Layout.css";
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbox from './Chatbox';

const Layout = ({ children }) => {
  const logout = useLogout();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search/${encodeURIComponent(query.trim())}`);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            🎬&nbsp;Movie Tickets
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Search bar */}

            <form className="d-flex ms-auto me-3" role="search" onSubmit={handleSearch}>
              <input
        className="form-control me-2"
        type="search"
        placeholder="Search movies..."
        aria-label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
              <button className="btn btn-outline-light" type="submit">
  Search
</button>

            </form>

            {/* Navigation Links */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/getAllMovies">
                  ALL Movies
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/recommendMovie">
                  Movie for you
                </Link>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="sidebar">
        <ul className="list-unstyled m-0 px-3">
          <li className="mb-3">
            <Link className="text-white text-decoration-none d-flex align-items-center sidebar-link" to="/">
              <i className="fas fa-home me-2"></i> Dashboard
            </Link>
          </li>
          <li className="mb-3">
            <Link className="text-white text-decoration-none d-flex align-items-center sidebar-link" to="/signup">
              <i className="fas fa-film me-2"></i> Signup
            </Link>
          </li>
          <li className="mb-3">
            <Link className="text-white text-decoration-none d-flex align-items-center sidebar-link" to="/login">
              <i className="fas fa-user me-2"></i>USER Profile
            </Link>
          </li>
          <li className="mb-3">
            <Link className="text-white text-decoration-none d-flex align-items-center sidebar-link" to="/admin">
              <i className="fas fa-user-shield me-2"></i> Admin
            </Link>
          </li>
          <li className="mb-3">
        <span
          onClick={logout}
          className="text-white text-decoration-none d-flex align-items-center sidebar-link"
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-user-shield me-2"></i> Logout
        </span>
      </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {children} 
      </div>
      <Chatbox />
    </div>
  );
};

export default Layout;
