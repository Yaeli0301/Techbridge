const requestLogger = (req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
};

module.exports = requestLogger;
