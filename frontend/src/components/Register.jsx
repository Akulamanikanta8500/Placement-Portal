import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    cgpa: '',
    skills: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cgpa' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await register(formData);
    
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      // The backend often returns text like "Email already exists" directly
      setError(result.message || 'Registration failed. This email might already be registered in the system.');
    }
    setIsLoading(false);
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel p-5 w-100" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary mb-1">Create Account</h2>
          <p className="text-secondary fw-semibold">Join the SVU Placement Portal</p>
        </div>
        
        {error && <div className="alert alert-danger bg-transparent border-danger text-danger fw-bold shadow-sm">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-secondary small fw-bold mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              className="form-control border-primary fw-semibold"
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. John Doe"
              required 
            />
          </div>

          <div className="mb-3">
            <label className="text-secondary small fw-bold mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="form-control border-primary fw-semibold"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="e.g. john@university.edu"
              required 
            />
          </div>
          
          <div className="mb-3">
            <label className="text-secondary small fw-bold mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-control border-primary fw-semibold"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="mb-3">
            <label className="text-secondary small fw-bold mb-1">Current CGPA</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              max="10"
              name="cgpa"
              className="form-control border-primary fw-semibold"
              value={formData.cgpa} 
              onChange={handleChange} 
              placeholder="e.g. 8.5"
              required 
            />
          </div>

          <div className="mb-4">
            <label className="text-secondary small fw-bold mb-1">Relevant Skills (Keywords)</label>
            <input 
              type="text" 
              name="skills"
              className="form-control border-primary fw-semibold"
              value={formData.skills} 
              onChange={handleChange} 
              placeholder="e.g. Java, React, SQL, AWS"
              required 
            />
          </div>
          
          <button type="submit" className="w-100 py-3 mt-2 shadow-sm rounded-pill fw-bold" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Submit Registration ➔'}
          </button>
        </form>

        <div className="mt-4 text-center border-top border-primary border-opacity-25 pt-4">
          <p className="text-secondary small fw-bold mb-0">Already registered? <Link to="/login" className="text-primary text-decoration-none ms-1">Sign In Here</Link></p>
        </div>

      </div>
    </div>
  );
};

export default Register;
