import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardActions, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch featured jobs from backend (limit 3)
    axios.get('/api/jobs?limit=3')
      .then(res => setFeaturedJobs(res.data))
      .catch(err => console.error('Failed to fetch featured jobs', err));

    // Fetch blog posts from backend (limit 3)
    axios.get('/api/blog?limit=3')
      .then(res => {
        if (Array.isArray(res.data)) {
          setBlogPosts(res.data);
        } else {
          console.error('Blog posts response is not an array:', res.data);
          setBlogPosts([]);
        }
      })
      .catch(err => console.error('Failed to fetch blog posts', err));
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#0d47a1', fontWeight: 'bold' }}>
          ברוכים הבאים לגיוס אייטק
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          השער שלך למשרות הטובות ביותר בתחום ההייטק ולכישרונות מובילים.
        </Typography>
        <Typography variant="body1" paragraph>
          גלו הזדמנויות עבודה מרגשות, צרו את הפרופיל שלכם, והתחברו למגייסים מובילים בתעשיית הטכנולוגיה.
        </Typography>
        <Typography variant="body1" paragraph>
          השתמשו בסרגל הניווט כדי לעיין במשרות, להירשם או להתחבר לחשבונכם.
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => navigate('/register')} sx={{ mr: 2, bgcolor: '#0d47a1' }}>
            הרשמה
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/jobs')}>
            חיפוש משרות
          </Button>
        </Box>
      </Box>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          משרות מומלצות
        </Typography>
        <Grid container spacing={2}>
          {featuredJobs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              אין משרות זמינות כרגע.
            </Typography>
          ) : (
            featuredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {job.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/jobs/${job._id}`)}>
                      פרטים נוספים
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
      <Box mb={4}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          בלוג וטיפים לקריירה
        </Typography>
        <Grid container spacing={2}>
          {blogPosts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              אין פוסטים זמינים כרגע.
            </Typography>
          ) : (
            blogPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {post.summary}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={post.url} target="_blank" rel="noopener" underline="hover" sx={{ ml: 1 }}>
                      קרא עוד
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
