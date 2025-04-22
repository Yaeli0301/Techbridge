const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    if (!req.user.role || req.user.role.trim() !== 'מגייס') {
      return res.status(403).json({ message: 'אין לך הרשאה לפרסם משרה' });
    }
    const { title, description, company, location, salary } = req.body;
    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      postedBy: req.user.id
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { skip = 0, limit = 10, search = '' } = req.query;
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    };
    const jobs = await Job.find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('postedBy', 'username email');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'username email');
    if (!job) {
      return res.status(404).json({ message: 'המשרה לא נמצאה' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'המשרה לא נמצאה' });
    }
    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: 'כבר הגשת מועמדות' });
    }
    job.applicants.push(req.user.id);
    await job.save();
    res.json({ message: 'הגשת מועמדות בוצעה בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

// New endpoint for recommended jobs based on user profile and alerts
exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = req.user;
    // For simplicity, recommend jobs matching user's alerts or role
    const User = require('../models/User');
    const fullUser = await User.findById(user.id);
    if (!fullUser) {
      return res.status(404).json({ message: 'המשתמש לא נמצא' });
    }
    const alerts = fullUser.alerts || [];
    const role = fullUser.role;

    let query = {};
    if (alerts.length > 0) {
      query = { field: { $in: alerts } };
    } else if (role) {
      query = { field: role === 'מועמד' ? 'פיתוח תוכנה' : 'מגייס' }; // example mapping
    }

    const jobs = await Job.find(query).limit(10).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ applicants: userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.find({ postedBy: userId }).populate('applicants', 'username email').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
