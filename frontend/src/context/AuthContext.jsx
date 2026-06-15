import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      const email = localStorage.getItem('email');
      const role = localStorage.getItem('role');
      const id = localStorage.getItem('id');
      setUser({ token, email, role, id });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role, id } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
      localStorage.setItem('id', id);
      
      setUser({ token, email, role, id });
      return { success: true, role };
    } catch (error) {
      return { 
        success: false, 
        message: typeof error.response?.data === 'string' ? error.response.data : (error.response?.data?.message || 'Login failed')
      };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: typeof error.response?.data === 'string' ? error.response.data : (error.response?.data?.message || 'Registration failed')
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
