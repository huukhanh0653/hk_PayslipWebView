function isAuthenticated(req, res, next) {
  console.log(req.user)
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

function isAdmin(req, res, next) {
  console.log(req.user)
  if (req.isAuthenticated() && req.user.Admin == true) {
    return next();
  } else
  return res.status(403).json({ message: 'Forbidden' });
}

module.exports = {isAuthenticated, isAdmin}