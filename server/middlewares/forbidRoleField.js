function forbidRoleField(req, res, next) {
  if (req.body && 'role' in req.body) {
    return res.status(400).json({ message: "אסור לשלוח תפקיד ברישום" });
  }
  next();
}

module.exports = forbidRoleField;
