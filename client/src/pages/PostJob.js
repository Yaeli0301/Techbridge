import React, { useState, useContext } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/jobs', { title, description, company, location, salary }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'המשרה פורסמה בהצלחה', severity: 'success' });
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
    } catch (err) {
      setSnackbar({ open: true, message: 'שגיאה בפרסום המשרה', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user || user.role !== 'מגייס') {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          אין לך הרשאה לגשת לעמוד זה.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        פרסום משרה חדשה
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextField label="תיאור" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} required />
        <TextField label="חברה" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <TextField label="מיקום" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <TextField label="שכר" value={salary} onChange={(e) => setSalary(e.target.value)} />
        <Button type="submit" variant="contained" color="primary">
          פרסם
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

export default PostJob;
