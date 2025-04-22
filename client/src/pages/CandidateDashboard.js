import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, Card, CardContent, CardActions, Button, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, refreshAppliedJobs } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingApplied, setLoadingApplied] = useState(true);
  const [errorFavorites, setErrorFavorites] = useState(null);
  const [errorApplied, setErrorApplied] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('/api/users/favorites');
        setFavorites(res.data);
        setFavoriteIds(new Set(res.data.map(job => job._id)));
      } catch (err) {
        console.error('Error fetching favorites:', err.response || err.message || err);
        const message = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'שגיאה בטעינת מועדפים';
        setErrorFavorites(message);
      } finally {
        setLoadingFavorites(false);
      }
    };
+
+  const toggleFavorite = async (jobId) => {
+    try {
+      if (favoriteIds.has(jobId)) {
+        await axios.delete(`/api/users/favorites/${jobId}`);
+        setFavoriteIds(prev => {
+          const newSet = new Set(prev);
+          newSet.delete(jobId);
+          return newSet;
+        });
+        setFavorites(prev => prev.filter(job => job._id !== jobId));
+      } else {
+        await axios.post('/api/users/favorites', { jobId });
+        // Optionally refetch favorites or add the job to favorites state
+        setFavoriteIds(prev => new Set(prev).add(jobId));
+        // For simplicity, refetch favorites
+        fetchFavorites();
+      }
+    } catch (err) {
+      console.error('Error toggling favorite:', err.response || err.message || err);
+    }
+  };

    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/jobs/applied');
        if (Array.isArray(res.data)) {
          setAppliedJobs(res.data);
        } else {
          console.warn('CandidateDashboard fetchAppliedJobs response is not an array:', res.data);
          setAppliedJobs([]);
        }
      } catch (err) {
        console.error('Error fetching applied jobs:', err.response || err.message || err);
        const message = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'שגיאה בטעינת משרות שהוגשו אליהן';
        setErrorApplied(message);
      } finally {
        setLoadingApplied(false);
      }
    };

    fetchFavorites();
    fetchAppliedJobs();

    const handleApplicationSubmitted = () => {
      fetchAppliedJobs();
    };

    window.addEventListener('applicationSubmitted', handleApplicationSubmitted);

    return () => {
      window.removeEventListener('applicationSubmitted', handleApplicationSubmitted);
    };
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        לוח בקרה למועמד
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          משרות שמורות
        </Typography>
        {loadingFavorites ? (
          <Typography>טוען מועדפים...</Typography>
        ) : errorFavorites ? (
          <Typography color="error">{errorFavorites}</Typography>
        ) : favorites.length === 0 ? (
          <Typography>אין משרות שמורות</Typography>
        ) : (
          favorites.map((job) => (
            <Card key={job._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography color="text.secondary">{job.company} - {job.location}</Typography>
                <Typography>{job.description}</Typography>
                <Typography>שכר: {job.salary ? job.salary + ' ₪' : 'לא צויין'}</Typography>
                <Typography>תאריך פרסום: {new Date(job.createdAt).toLocaleDateString()}</Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => toggleFavorite(job._id)} color={favoriteIds.has(job._id) ? 'error' : 'default'}>
                  {favoriteIds.has(job._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <Button size="small" onClick={() => navigate(`/job-details/${job._id}`)}>
                  פרטי משרה
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          משרות שהוגשו אליהן בקשה
        </Typography>
        {loadingApplied ? (
          <Typography>טוען משרות שהוגשו אליהן...</Typography>
        ) : errorApplied ? (
          <Typography color="error">{errorApplied}</Typography>
        ) : appliedJobs.length === 0 ? (
          <Typography>לא הוגשו בקשות למשרות</Typography>
        ) : (
          appliedJobs.map((job) => (
            <Card key={job._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography color="text.secondary">{job.company} - {job.location}</Typography>
                <Typography>{job.description}</Typography>
                <Typography>שכר: {job.salary ? job.salary + ' ₪' : 'לא צויין'}</Typography>
                <Typography>תאריך פרסום: {new Date(job.createdAt).toLocaleDateString()}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/job-details/${job._id}`)}>
                  פרטי משרה
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
};

export default CandidateDashboard;
