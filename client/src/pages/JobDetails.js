import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const { user, refreshAppliedJobs, setRefreshAppliedJobs } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [applied, setApplied] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || ''}/api/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'נכשל בטעינת פרטי המשרה', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const applyToJob = async () => {
    setApplyLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({ open: true, message: 'אנא התחבר כדי להגיש מועמדות', severity: 'warning' });
        setApplyLoading(false);
        return;
      }
      await axios.post(`${process.env.REACT_APP_BACKEND_URL || ''}/api/jobs/${id}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'הגשת המועמדות בוצעה בהצלחה', severity: 'success' });
      setApplied(true);
      setRefreshAppliedJobs(prev => !prev);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'נכשל בהגשת המועמדות', severity: 'error' });
    } finally {
      setApplyLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <Container>טוען...</Container>;
  if (!job) return <Container>לא נמצאה משרה</Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {job.company} - {job.location}
      </Typography>
      <Typography variant="body1" paragraph>
        {job.description}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Salary: {job.salary}
      </Typography>
      {user && user.role === 'מועמד' && user._id !== job.postedBy && (
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={applyToJob} disabled={applyLoading || applied}>
            {applyLoading ? 'שולח...' : applied ? 'הוגשה מועמדות' : 'הגש מועמדות'}
          </Button>
        </Box>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JobDetails;
