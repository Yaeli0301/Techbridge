import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Alerts = () => {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) {
        setAlerts([]);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/users/alerts');
        setAlerts(res.data);
      } catch (err) {
        setError('שגיאה בטעינת ההתראות');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [user]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, color: '#0d47a1', fontWeight: 'bold' }}>
        התראות מערכת
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : alerts.length === 0 ? (
          <Typography>אין התראות כרגע</Typography>
        ) : (
          <List>
            {alerts.map((alert, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={alert} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Alerts;
