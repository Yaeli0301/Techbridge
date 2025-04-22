import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Messaging = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    // Fetch conversations or users to message - simplified as all users except self
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const otherUsers = res.data.filter(u => u._id !== user.id);
        setConversations(otherUsers);
      } catch (err) {
        setSnackbar({ open: true, message: 'שגיאה בטעינת משתמשים', severity: 'error' });
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchMessages = async (withUserId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/messaging?withUserId=${withUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'שגיאה בטעינת הודעות', severity: 'error' });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/messaging/send', { recipientId: selectedUserId, content: newMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      fetchMessages(selectedUserId);
    } catch (err) {
      setSnackbar({ open: true, message: 'שגיאה בשליחת ההודעה', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0d47a1', fontWeight: 'bold' }}>
        הודעות פרטיות
      </Typography>
      <Box display="flex" gap={2}>
        <Box sx={{ width: '30%', borderRight: '1px solid #ccc', maxHeight: 400, overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>שיחות</Typography>
          <List>
            {conversations.map((conv) => (
              <ListItem
                button
                key={conv._id}
                selected={conv._id === selectedUserId}
                onClick={() => setSelectedUserId(conv._id)}
              >
                <ListItemText primary={conv.username} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ width: '70%', maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
            {messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">בחר שיחה כדי לראות הודעות</Typography>
            ) : (
              messages.map((msg) => (
                <Box
                  key={msg._id}
                  sx={{
                    mb: 1,
                    textAlign: msg.sender === user.id ? 'right' : 'left',
                    bgcolor: msg.sender === user.id ? '#cfe9ff' : '#e0e0e0',
                    p: 1,
                    borderRadius: 1,
                    maxWidth: '80%',
                    marginLeft: msg.sender === user.id ? 'auto' : '0',
                    marginRight: msg.sender === user.id ? '0' : 'auto'
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(msg.sentAt).toLocaleString()}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="הקלד הודעה..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            />
            <Button variant="contained" onClick={sendMessage}>שלח</Button>
          </Box>
        </Box>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Messaging;
