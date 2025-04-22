import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, TextField, InputAdornment, IconButton } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      window.location.href = `/jobs?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: '80vh',
          backgroundImage: 'url(/image/תמונה לדף הבית.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            מצאו את המשרה הבאה שלכם ב-TechBridge
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
            פלטפורמה חדשנית לחיפוש משרות, יצירת קשר עם מגייסים וניהול שיחות פרטיות
          </Typography>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            sx={{ display: 'flex', justifyContent: 'center', maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            <TextField
              variant="outlined"
              placeholder="חפש משרה, חברה או מיקום"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end" aria-label="search">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'white', borderRadius: 1 }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
            href="/jobs"
          >
            חפש משרות
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            href="/register"
          >
            הצטרף עכשיו
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center" textAlign="center">
          <Grid item xs={12} md={4}>
            <WorkIcon sx={{ fontSize: 60, color: '#0d47a1', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              משרות איכותיות
            </Typography>
            <Typography variant="body1" color="text.secondary">
              גישה למגוון רחב של משרות טכנולוגיות מובילות בישראל.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <PeopleIcon sx={{ fontSize: 60, color: '#0d47a1', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              יצירת קשר עם מגייסים
            </Typography>
            <Typography variant="body1" color="text.secondary">
              תקשורת ישירה עם מגייסים ומנהלי משאבי אנוש.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChatIcon sx={{ fontSize: 60, color: '#0d47a1', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              שיחות פרטיות
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ניהול שיחות פרטיות עם מגייסים ומועמדים אחרים בפלטפורמה.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
