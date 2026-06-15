import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AdminPortal from './components/AdminPortal';
import StudentPortal from './components/StudentPortal';
import JobsPortal from './components/JobsPortal';
import Dashboard from './components/Dashboard';
import AnimatedBackground from './components/AnimatedBackground';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center py-5 text-light">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/student'} />;
  }
  return children;
};

const AppContent = () => {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminPortal /></PrivateRoute>} />
        <Route path="/student" element={<PrivateRoute allowedRoles={['STUDENT']}><StudentPortal /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute allowedRoles={['STUDENT']}><JobsPortal /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute allowedRoles={['STUDENT']}><Dashboard /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
