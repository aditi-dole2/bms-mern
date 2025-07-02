import React from 'react';
import { Link } from 'react-router-dom';
import useLogout from './Logout';
import "../style/Layout.css";

const Layout = ({ children }) => {
  const logout = useLogout();
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

            <form className="d-flex ms-auto me-3" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search movies..."
                aria-label="Search"
              />
              <Link className="btn btn-outline-light" type="submit" to="/search">
                Search
              </Link>
            </form>

            {/* Navigation Links */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/getAllMoviesAdmin">
                  ALL Movies
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
                    <Link className="text-white text-decoration-none d-flex align-items-center sidebar-link" to="/dashboard">
                      <i className="fas fa-film me-2"></i> Dashboard
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
    </div>
  );
};

export default Layout;
