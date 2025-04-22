import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RecruiterHome = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        ברוכים הבאים ללוח הבקרה של המגייס
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        כאן תוכלו לפרסם משרות חדשות, לצפות במועמדים שהגישו בקשות ולנהל את המשרות שלכם.
      </Typography>
      <Box>
        <Button variant="contained" color="primary" onClick={() => navigate('/post-job')} sx={{ mr: 2 }}>
          פרסם משרה חדשה
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/dashboard')}>
          עבור ללוח הבקרה
        </Button>
      </Box>
    </Container>
  );
};

export default RecruiterHome;
