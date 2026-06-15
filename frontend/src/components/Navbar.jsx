import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass-panel sticky-top mx-3 mt-3 rounded-pill px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white d-flex align-items-center gap-2" to={user?.role === 'ADMIN' ? '/admin' : '/home'}>
          <span className="fs-3">🎓</span> SVU Placement
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {(!user || user.role === 'STUDENT') && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/home">Home</Link>
              </li>
            )}
            {user?.role === 'STUDENT' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/jobs">Jobs Portal</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/student">Student Dashboard</Link>
                </li>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin">Admin Portal</Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="text-white me-3 small d-none d-md-block fw-bold">{user.email}</span>
                <button className="btn btn-outline-light btn-sm rounded-pill border-2 fw-bold px-3 py-1" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <Link to="/login" className="btn-glass rounded-pill fw-bold px-4 py-2 text-decoration-none">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
