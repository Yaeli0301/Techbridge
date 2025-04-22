import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CandidateHome = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        ברוכים הבאים ללוח הבקרה של המועמד
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        כאן תוכלו לחפש משרות, לשמור משרות מועדפות ולעקוב אחרי בקשות העבודה שלכם.
      </Typography>
      <Box>
        <Button variant="contained" color="primary" onClick={() => navigate('/jobs')} sx={{ mr: 2 }}>
          חפש משרות
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/dashboard')}>
          עבור ללוח הבקרה
        </Button>
      </Box>
    </Container>
  );
};

export default CandidateHome;
