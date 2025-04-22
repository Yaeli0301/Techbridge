import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

// Set axios baseURL explicitly to backend URL to avoid proxy issues
axios.defaults.baseURL = 'http://localhost:5000';

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    const exp = decoded.exp * 1000; // convert to ms
    return Date.now() > exp;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [refreshAppliedJobs, setRefreshAppliedJobs] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        delete axios.defaults.headers.common['Authorization'];
      } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (!user) {
          axios.get('/api/auth/me')
            .then(res => {
              setUser(res.data);
              localStorage.setItem('user', JSON.stringify(res.data));
              setLoading(false);
            })
            .catch(err => {
              console.error('AuthContext /api/auth/me error:', err);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              setLoading(false);
              delete axios.defaults.headers.common['Authorization'];
            });
        } else {
          setLoading(false);
        }
      }
    } else {
      setLoading(false);
    }
  }, []);


  const login = (token, userData) => {
    if (isTokenExpired(token)) {
      logout();
      return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshAppliedJobs, setRefreshAppliedJobs }}>
      {children}
    </AuthContext.Provider>
  );
};
