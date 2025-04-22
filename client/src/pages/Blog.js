import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Link, Button, Snackbar, Alert, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/blog');
      setPosts(res.data);
      // Initialize comments state for each post
      const initialComments = {};
      res.data.forEach(post => {
        initialComments[post._id] = post.comments || [];
      });
      setComments(initialComments);
    } catch (err) {
      setSnackbar({ open: true, message: 'שגיאה בטעינת הפוסטים', severity: 'error' });
    }
  };

  const handleAddComment = (postId) => {
    if (!newComment[postId] || newComment[postId].trim() === '') return;
    // For demo, just add comment locally
    const updatedComments = { ...comments };
    updatedComments[postId] = [
      ...updatedComments[postId],
      {
        id: Date.now(),
        author: 'משתמש',
        content: newComment[postId],
        avatar: '', // Could add avatar url
      },
    ];
    setComments(updatedComments);
    setNewComment({ ...newComment, [postId]: '' });
  };

  const handleCommentChange = (postId, value) => {
    setNewComment({ ...newComment, [postId]: value });
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
            <Grid item xs={12} key={post._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {post.summary}
                  </Typography>
                  <Link href={post.url} target="_blank" rel="noopener" underline="hover" sx={{ mb: 2, display: 'block' }}>
                    קרא עוד
                  </Link>
                  {/* Comments Section */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      תגובות
                    </Typography>
                    <List dense>
                      {comments[post._id] && comments[post._id].length > 0 ? (
                        comments[post._id].map((comment) => (
                          <ListItem key={comment.id} alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar>{comment.author.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={comment.author}
                              secondary={comment.content}
                            />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          אין תגובות עדיין.
                        </Typography>
                      )}
                    </List>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="הוסף תגובה..."
                        value={newComment[post._id] || ''}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post._id); }}
                      />
                      <Button variant="contained" onClick={() => handleAddComment(post._id)}>
                        שלח
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
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
