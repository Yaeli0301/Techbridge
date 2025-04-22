import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, CardActions, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!axios.defaults.headers.common['Authorization'] || !user) {
        setError('Unauthorized: Please log in');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/jobs/my-jobs'); // Corrected endpoint to plural 'jobs'
        console.log('RecruiterDashboard fetchJobs response:', res.data);
        if (Array.isArray(res.data)) {
          setJobs(res.data);
        } else {
          console.warn('RecruiterDashboard fetchJobs response is not an array:', res.data);
          setJobs([]);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err.response || err.message || err);
        const message = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'שגיאה בטעינת המשרות';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        לוח בקרה למגייס
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/post-job')}>
          פרסם משרה חדשה
        </Button>
      </Box>
      {loading ? (
        <Typography>טוען משרות...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : !Array.isArray(jobs) || jobs.length === 0 ? (
        <Typography>אין משרות שפורסמו</Typography>
      ) : (
        <>
          {console.log('RecruiterDashboard render jobs:', jobs, 'type:', typeof jobs)}
          {(Array.isArray(jobs) ? jobs : []).map((job) => (
            <Card key={job._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography color="text.secondary">{job.company} - {job.location}</Typography>
                <Typography>{job.description}</Typography>
                <Typography>שכר: {job.salary ? job.salary + ' ₪' : 'לא צויין'}</Typography>
                <Typography>תאריך פרסום: {new Date(job.createdAt).toLocaleDateString()}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1">מועמדים שהגישו בקשה:</Typography>
                {job.applicants && job.applicants.length > 0 ? (
                  <List dense>
                    {job.applicants.map((applicant) => (
                      <ListItem key={applicant._id} button onClick={() => navigate(`/profile/${applicant._id}`)}>
                        <ListItemText primary={applicant.username} secondary={applicant.email} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>אין מועמדים שהגישו בקשה למשרה זו</Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/job-details/${job._id}`)}>
                  פרטי משרה
                </Button>
              </CardActions>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default RecruiterDashboard;
