import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, TextField, Grid, Card, CardContent, CardActions, Button, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [field, setField] = useState('');
  const [experience, setExperience] = useState('');
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const query = useQuery();

  useEffect(() => {
    const searchParam = query.get('search') || '';
    setSearch(searchParam);
  }, [query]);

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchFavorites();
      fetchAlerts();
    }
  }, [search, location, field, experience, user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (field) params.field = field;
      if (experience) params.experience = experience;

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || ''}/api/jobs`, { params });
      setJobs(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'נכשל בטעינת המשרות', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || ''}/api/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data);
    } catch (err) {
      // silently fail or show error if needed
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || ''}/api/users/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(res.data);
    } catch (err) {
      // silently fail or show error if needed
    }
  };

  const toggleFavorite = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (favorites.includes(jobId)) {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL || ''}/api/users/favorites/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(id => id !== jobId));
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL || ''}/api/users/favorites`, { jobId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites([...favorites, jobId]);
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'שגיאה בעדכון מועדפים', severity: 'error' });
    }
  };

  const createAlert = async () => {
    if (!field) {
      setSnackbar({ open: true, message: 'בחר תחום עיסוק ליצירת התראה', severity: 'warning' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL || ''}/api/users/alerts`, { field }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts([...alerts, field]);
      setSnackbar({ open: true, message: 'התראה נוצרה בהצלחה', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'שגיאה ביצירת התראה', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0d47a1', fontWeight: 'bold' }}>
        רשימת משרות
      </Typography>
      <TextField
        label="חפש משרות"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="location-label">מיקום</InputLabel>
        <Select
          labelId="location-label"
          value={location}
          label="מיקום"
          onChange={(e) => setLocation(e.target.value)}
        >
          <MenuItem value="">הכל</MenuItem>
          <MenuItem value="תל אביב">תל אביב</MenuItem>
          <MenuItem value="ירושלים">ירושלים</MenuItem>
          <MenuItem value="חיפה">חיפה</MenuItem>
          <MenuItem value="באר שבע">באר שבע</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="field-label">תחום עיסוק</InputLabel>
        <Select
          labelId="field-label"
          value={field}
          label="תחום עיסוק"
          onChange={(e) => setField(e.target.value)}
        >
          <MenuItem value="">הכל</MenuItem>
          <MenuItem value="פיתוח תוכנה">פיתוח תוכנה</MenuItem>
          <MenuItem value="עיצוב">עיצוב</MenuItem>
          <MenuItem value="שיווק">שיווק</MenuItem>
          <MenuItem value="מכירות">מכירות</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="experience-label">רמת ניסיון</InputLabel>
        <Select
          labelId="experience-label"
          value={experience}
          label="רמת ניסיון"
          onChange={(e) => setExperience(e.target.value)}
        >
          <MenuItem value="">הכל</MenuItem>
          <MenuItem value="מתחיל">מתחיל</MenuItem>
          <MenuItem value="בינוני">בינוני</MenuItem>
          <MenuItem value="מנוסה">מנוסה</MenuItem>
          <MenuItem value="מומחה">מומחה</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" color="primary" sx={{ mb: 2 }} onClick={createAlert}>
        צור התראה למשרות בתחום זה
      </Button>
      {loading ? (
        <Typography>טוען משרות...</Typography>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} key={job._id}>
              <Card sx={{ position: 'relative' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{job.title}</Typography>
                  <Typography color="text.secondary">{job.company}</Typography>
                  <Typography variant="body2" noWrap>{job.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to={`/job-details/${job._id}`} size="small">
                    פרטים
                  </Button>
                  <IconButton
                    aria-label="favorite"
                    onClick={() => toggleFavorite(job._id)}
                    sx={{ color: favorites.includes(job._id) ? '#d32f2f' : 'inherit' }}
                  >
                    {favorites.includes(job._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Jobs;
