module.exports = (req, res, next) => {
    if (!req.tenant) {
        return res.status(401).json({ message: process.env.LOGIN_FIRST });
    } else {
      next();
    }
  };