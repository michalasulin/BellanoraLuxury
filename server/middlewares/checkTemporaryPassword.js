async function checkTemporaryPassword(req, res, next) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "לא מאומת" });
  }

  if (user.isTemporary) {
    return res.status(403).json({
      message: "הגישה חסומה. יש לעדכן את הסיסמה הזמנית לפני המשך השימוש במערכת."
    });
  }

  next();
}

module.exports = checkTemporaryPassword;
