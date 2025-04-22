const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    if (!recipientId || !content) {
      return res.status(400).json({ message: 'יש לספק מקבל ותוכן הודעה' });
    }
    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { withUserId } = req.query;
    if (!withUserId) {
      return res.status(400).json({ message: 'יש לספק מזהה משתמש לשיחה' });
    }
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: withUserId },
        { sender: withUserId, recipient: req.user.id }
      ]
    }).sort({ sentAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'ההודעה לא נמצאה' });
    }
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'ההודעה לא נמצאה' });
    }
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'אין הרשאה לעדכן הודעה זו' });
    }
    message.content = content;
    await message.save();
    res.json({ message: 'ההודעה עודכנה בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'ההודעה לא נמצאה' });
    }
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'אין הרשאה למחוק הודעה זו' });
    }
    await message.remove();
    res.json({ message: 'ההודעה נמחקה בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
