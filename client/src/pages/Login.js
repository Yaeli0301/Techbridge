import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL || ''}/api/auth/login`, data);
      login(res.data.token, res.data.user);
      navigate('/dashboard');  // Redirect to role-based dashboard after login
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'התחברות נכשלה', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
        התחברות
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="שם משתמש"
          fullWidth
          margin="normal"
          {...register('username', { required: 'שם משתמש הוא שדה חובה' })}
          error={!!errors.username}
          helperText={errors.username?.message}
          autoFocus
          inputProps={{ 'aria-label': 'שם משתמש' }}
        />
        <TextField
          label="סיסמה"
          type="password"
          fullWidth
          margin="normal"
          {...register('password', { required: 'סיסמה היא שדה חובה' })}
          error={!!errors.password}
          helperText={errors.password?.message}
          inputProps={{ 'aria-label': 'סיסמה' }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? 'טוען...' : 'התחברות'}
        </Button>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
