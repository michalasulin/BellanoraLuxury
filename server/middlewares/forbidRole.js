function forbidRole(allowedRoles = []) {
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'אין לך הרשאה לבצע פעולה זו' });
    }
    next();
  };
}

module.exports = forbidRole;
