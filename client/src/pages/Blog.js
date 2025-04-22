import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Link, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/blog');
      setPosts(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'שגיאה בטעינת הפוסטים', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0d47a1', fontWeight: 'bold' }}>
        בלוג וטיפים לקריירה
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate('/blog/new')}>
        הוסף פוסט חדש
      </Button>
      <Grid container spacing={2}>
        {posts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            אין פוסטים זמינים כרגע.
          </Typography>
        ) : (
          posts.map((post) => (
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
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Blog;
