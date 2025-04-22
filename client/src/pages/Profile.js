import React, { useContext, useState, useRef } from 'react';
import { Container, Typography, Box, Button, Avatar, Snackbar, Alert, TextField, Link as MuiLink, Rating } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, logout, login } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || ''
  });
  const [rating, setRating] = useState(user?.rating || 0);
  const fileInputRef = useRef();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      // Fetch updated user data after profile image update
      const userRes = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileImage(userRes.data.profileImage);
      login(token, userRes.data);
      setSnackbar({ open: true, message: 'תמונת הפרופיל עודכנה בהצלחה', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'העלאת התמונה נכשלה, נסה שוב', severity: 'error' });
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      login(token, res.data);
      setEditMode(false);
      setSnackbar({ open: true, message: 'הפרופיל עודכן בהצלחה', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'עדכון הפרופיל נכשל, נסה שוב', severity: 'error' });
    }
  };

  const handleRatingChange = async (event, newValue) => {
    setRating(newValue);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/rating', { rating: newValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'הדירוג עודכן בהצלחה', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'עדכון הדירוג נכשל, נסה שוב', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        פרופיל
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar
          src={profileImage ? `/uploads/${profileImage}?t=${Date.now()}` : ''}
          alt={user?.username}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <Button variant="contained" onClick={() => fileInputRef.current.click()}>
          העלאת תמונת פרופיל
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
          aria-label="Upload profile image"
        />
      </Box>
      {editMode ? (
        <>
          <TextField
            label="שם משתמש"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleInputChange}
          />
          <TextField
            label="אימייל"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            label="קישור לפרופיל LinkedIn"
            name="linkedin"
            fullWidth
            margin="normal"
            value={formData.linkedin}
            onChange={handleInputChange}
          />
          <TextField
            label="קישור לתיק עבודות"
            name="portfolio"
            fullWidth
            margin="normal"
            value={formData.portfolio}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
            שמור שינויים
          </Button>
          <Button variant="text" onClick={() => setEditMode(false)} sx={{ mt: 1 }}>
            ביטול
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h6">שם משתמש: {user?.username}</Typography>
          <Typography variant="h6">אימייל: {user?.email}</Typography>
          <Typography variant="h6">
            קישור LinkedIn:{' '}
            {user?.linkedin ? (
              <MuiLink href={user.linkedin} target="_blank" rel="noopener noreferrer">
                {user.linkedin}
              </MuiLink>
            ) : (
              'לא קיים'
            )}
          </Typography>
          <Typography variant="h6">
            תיק עבודות:{' '}
            {user?.portfolio ? (
              <MuiLink href={user.portfolio} target="_blank" rel="noopener noreferrer">
                {user.portfolio}
              </MuiLink>
            ) : (
              'לא קיים'
            )}
          </Typography>
          <Typography variant="h6">תפקיד: {user?.role}</Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              דירוג:
            </Typography>
            <Rating
              name="user-rating"
              value={rating}
              onChange={handleRatingChange}
              precision={1}
              max={5}
            />
          </Box>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>
            ערוך פרופיל
          </Button>
        </>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
