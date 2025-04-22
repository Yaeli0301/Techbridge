const User = require('../models/User');

exports.getAlerts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    res.json(user.alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getAlertById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.alerts.includes(req.params.id)) {
      return res.status(404).json({ message: 'התראה לא נמצאה' });
    }
    res.json({ alert: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { field } = req.body;
    if (!field) {
      return res.status(400).json({ message: 'יש לספק תחום עיסוק' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    if (user.alerts.includes(field)) {
      return res.status(400).json({ message: 'התראה כבר קיימת עבור תחום זה' });
    }
    user.alerts.push(field);
    await user.save();
    res.json({ message: 'התראה נוצרה בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const { newField } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    const index = user.alerts.indexOf(req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'התראה לא נמצאה' });
    }
    user.alerts[index] = newField;
    await user.save();
    res.json({ message: 'התראה עודכנה בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.removeAlert = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    user.alerts = user.alerts.filter(alert => alert !== req.params.id);
    await user.save();
    res.json({ message: 'התראה הוסרה בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
