import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText, Snackbar, Alert, Avatar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [profilePreview, setProfilePreview] = useState(null);

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('role', data.role);
      if (data.profileImage && data.profileImage[0]) {
        formData.append('profileImage', data.profileImage[0]);
      }
      if (data.linkedin) {
        formData.append('linkedin', data.linkedin);
      }
      if (data.portfolio) {
        formData.append('portfolio', data.portfolio);
      }
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL || ''}/api/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'הרשמה נכשלה', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePreview(null);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, bgcolor: '#f5f9fc', p: 4, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0d47a1', fontWeight: 'bold', mb: 3 }}>
        הרשמה
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box display="flex" justifyContent="center" mb={2}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-image-upload"
            type="file"
            {...register('profileImage')}
            onChange={(e) => {
              handleProfileImageChange(e);
              register('profileImage').onChange(e);
            }}
          />
          <label htmlFor="profile-image-upload">
            <Avatar
              src={profilePreview}
              sx={{ width: 80, height: 80, cursor: 'pointer', border: '2px solid #0d47a1' }}
            />
          </label>
        </Box>
        <TextField
          label="שם משתמש"
          fullWidth
          margin="normal"
          placeholder="הכנס שם משתמש"
          {...register('username', { required: 'שם משתמש הוא שדה חובה' })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <TextField
          label="אימייל"
          type="email"
          fullWidth
          margin="normal"
          placeholder="example@mail.com"
          {...register('email', {
            required: 'אימייל הוא שדה חובה',
            pattern: { value: /^\S+@\S+$/i, message: 'כתובת אימייל לא תקינה' }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="סיסמה"
          type="password"
          fullWidth
          margin="normal"
          placeholder="לפחות 6 תווים"
          {...register('password', { required: 'סיסמה היא שדה חובה', minLength: { value: 6, message: 'מינימום 6 תווים' } })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="אימות סיסמה"
          type="password"
          fullWidth
          margin="normal"
          placeholder="הכנס שוב את הסיסמה"
          {...register('passwordConfirm', {
            required: 'אימות סיסמה הוא שדה חובה',
            validate: value => value === password || 'הסיסמאות אינן תואמות'
          })}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm?.message}
        />
        <TextField
          label="קישור לפרופיל LinkedIn"
          type="url"
          fullWidth
          margin="normal"
          placeholder="https://www.linkedin.com/in/yourprofile"
          {...register('linkedin', {
            pattern: { value: /^https?:\/\/(www\.)?linkedin\.com\/.*$/, message: 'קישור LinkedIn לא תקין' }
          })}
          error={!!errors.linkedin}
          helperText={errors.linkedin?.message}
        />
        <TextField
          label="קישור לתיק עבודות"
          type="url"
          fullWidth
          margin="normal"
          placeholder="https://yourportfolio.com"
          {...register('portfolio', {
            pattern: { value: /^https?:\/\/.+$/, message: 'קישור תיק עבודות לא תקין' }
          })}
          error={!!errors.portfolio}
          helperText={errors.portfolio?.message}
        />
        <FormControl fullWidth margin="normal" error={!!errors.role}>
          <InputLabel id="role-label">תפקיד</InputLabel>
          <Select
            labelId="role-label"
            label="תפקיד"
            defaultValue=""
            {...register('role', { required: 'תפקיד הוא שדה חובה' })}
          >
            <MenuItem value="מועמד">מועמד</MenuItem>
            <MenuItem value="מגייס">מגייס</MenuItem>
          </Select>
          <FormHelperText>{errors.role?.message}</FormHelperText>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, bgcolor: '#0d47a1' }} disabled={loading}>
          {loading ? 'טוען...' : 'הרשמה'}
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

export default Register;
