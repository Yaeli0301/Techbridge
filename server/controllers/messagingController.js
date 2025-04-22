const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId, content } = req.body;
    console.log('sendMessage called with:', { senderId, recipientId, content });
    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient and content are required' });
    }
    const message = new Message({
      sender: new ObjectId(senderId),
      recipient: new ObjectId(recipientId),
      content,
    });
    await message.save();
    console.log('Message saved:', message);
    res.status(201).json(message);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = new ObjectId(req.user.id);
    const withUserId = new ObjectId(req.query.withUserId);
    console.log('getMessages called with:', { userId, withUserId });
    if (!withUserId) {
      return res.status(400).json({ message: 'withUserId query parameter is required' });
    }
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: withUserId },
        { sender: withUserId, recipient: userId }
      ]
    }).sort({ sentAt: 1 });
    console.log('Messages found:', messages.length);
    res.status(200).json(messages);
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
