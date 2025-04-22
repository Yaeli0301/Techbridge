import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Snackbar, Alert, Avatar } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Messaging = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(() => {
    return localStorage.getItem('selectedUserId') || '';
  });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const messagesEndRef = useRef(null);

  useEffect(() => {
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
      localStorage.setItem('selectedUserId', selectedUserId);
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async (withUserId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/messaging?withUserId=${withUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(Array.isArray(res.data) ? res.data : []);
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

  const isSender = (msgSender) => {
    if (!msgSender) return false;
    if (typeof msgSender === 'string') {
      return msgSender === user.id;
    }
    if (typeof msgSender === 'object' && msgSender._id) {
      return msgSender._id === user.id;
    }
    return false;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0d47a1', fontWeight: 'bold' }}>
        הודעות פרטיות
      </Typography>
      <Box display="flex" gap={2} height="600px" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ width: { xs: '100%', md: '30%' }, borderRight: { md: '1px solid #ccc' }, overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>שיחות</Typography>
          <List>
            {conversations.map((conv) => (
              <ListItem
                button
                key={conv._id}
                selected={conv._id === selectedUserId}
                onClick={() => setSelectedUserId(conv._id)}
              >
                {conv.profileImage ? (
                  <Avatar
                    alt={conv.username}
                    src={`/uploads/${conv.profileImage}`}
                    sx={{ mr: 1 }}
                  />
                ) : (
                  <Avatar sx={{ mr: 1 }}>{conv.username.charAt(0).toUpperCase()}</Avatar>
                )}
                <ListItemText primary={conv.username} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '70%' }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 1 }}>
            {!selectedUserId ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                בחר שיחה כדי לראות הודעות
              </Typography>
            ) : messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                אין הודעות בשיחה זו
              </Typography>
            ) : (
              messages.map((msg) => {
                const senderIsUser = isSender(msg.sender);
                return (
                  <Box
                    key={msg._id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: senderIsUser ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: senderIsUser ? '#0b93f6' : '#e5e5ea',
                        color: senderIsUser ? 'white' : 'black',
                        p: 1.5,
                        borderRadius: 2,
                        maxWidth: '70%',
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {new Date(msg.sentAt).toLocaleString()}
                    </Typography>
                  </Box>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </Box>
          {selectedUserId && (
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
          )}
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
