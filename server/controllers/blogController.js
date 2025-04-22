const Blog = require('../models/Blog');

exports.getBlogPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const posts = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.getBlogPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'הפוסט לא נמצא' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.createBlogPost = async (req, res) => {
  try {
    const { title, summary, content, url } = req.body;
    const post = new Blog({ title, summary, content, url });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.updateBlogPost = async (req, res) => {
  try {
    const { title, summary, content, url } = req.body;
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'הפוסט לא נמצא' });
    }
    post.title = title || post.title;
    post.summary = summary || post.summary;
    post.content = content || post.content;
    post.url = url || post.url;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'הפוסט לא נמצא' });
    }
    await post.remove();
    res.json({ message: 'הפוסט נמחק בהצלחה' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};
