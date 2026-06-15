import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      if (result.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel p-5 w-100" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-block p-3 rounded-circle mb-3 glass-panel border border-primary">
            <span className="fs-2 d-block">👋</span>
          </div>
          <h2 className="fw-bold text-primary mb-1">Welcome Back</h2>
          <p className="text-secondary fw-semibold">Sign in to the Placement Portal</p>
        </div>
        
        {error && <div className="alert alert-danger bg-transparent border-danger text-danger fw-bold shadow-sm">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-secondary small fw-bold mb-1">Email Address</label>
            <input 
              type="email" 
              className="form-control border-primary fw-semibold"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="student@university.edu"
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="text-secondary small fw-bold mb-1">Password</label>
            <input 
              type="password" 
              className="form-control border-primary fw-semibold"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button type="submit" className="w-100 py-3 shadow-sm rounded-pill fw-bold" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Secure Sign In ➔'}
          </button>
        </form>

        <div className="mt-4 text-center border-top border-primary border-opacity-25 pt-4">
          <p className="text-secondary small fw-bold mb-0">Don't have an account? <Link to="/register" className="text-primary text-decoration-none ms-1">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
