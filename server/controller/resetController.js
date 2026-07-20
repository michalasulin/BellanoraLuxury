const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const RESET_FILE = path.join(__dirname, '../data/reset_requests.json');
const SALT_ROUNDS = 10;
function normalizePhone(phone) {
  return phone?.toString().replace(/\s|-/g, '').replace(/^(\+972|972)/, '0').trim();
}
function generateRandomPassword(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function loadResetRequests() {
  try {
    const content = await fs.readFile(RESET_FILE, 'utf-8');
    const allRequests = JSON.parse(content);
    const validRequests = allRequests.filter(r =>
      new Date(r.expiresAt) > new Date()
    );
    return validRequests;
  } catch {
    return [];
  }
}

async function saveResetRequests(requests) {
  await fs.writeFile(RESET_FILE, JSON.stringify(requests, null, 2));
}

async function requestPasswordReset(req, res) {
    console.log("בקשה התקבלה"); // לבדוק אם הפונקציה נקראה

  const { tz, email, telephone } = req.body;
  console.log(`מנסים למצוא משתמש עם: ת"ז - ${tz}, אימייל - ${email}, טלפון - ${telephone}`);

  try {
    const userData = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(userData);
    const user = users.find(u =>
  u.tz === tz && 
  u.email === email && 
  normalizePhone(u.telephone) === normalizePhone(telephone)
);
console.log(user); // לראות אם המשתמש נמצא או לא

    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא לפי הפרטים שסופקו.' });
    }

    const resetRequests = await loadResetRequests();

    const twelveHoursAgo = Date.now() - 1000 * 60 * 60 * 12;
    const alreadyRequested = resetRequests.find(r =>
      r.userId === user.id && new Date(r.createdAt).getTime() > twelveHoursAgo
    );
    if (alreadyRequested) {
      return res.status(429).json({ message: 'כבר בוצעה בקשת איפוס לאחרונה. נא להמתין.' });
    }

    const newPlainPassword = generateRandomPassword(8);
    const hashed = await bcrypt.hash(newPlainPassword, SALT_ROUNDS);

    user.password = hashed;
    user.isTemporary = true;
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    resetRequests.push({
      userId: user.id,
      email: user.email,
      tz: user.tz,
      phone: user.telephone,
      newPassword: newPlainPassword,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
    });

    await saveResetRequests(resetRequests);

    return res.json({
      message: 'סיסמה זמנית נוצרה, יש לשנותה בהקדם.',
      temporaryPassword: newPlainPassword,
      validUntil: resetRequests[resetRequests.length - 1].expiresAt
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'שגיאה בשרת בעת ניסיון לאיפוס סיסמה.' });
  }
}

async function getTemporaryPassword(req, res) {
  const { email, tz, phone } = req.body;
  if (!email || !tz || !phone) {
    return res.status(400).json({ message: "נא למלא אימייל טלפון ות''ז" });
  }

  try {
    const data = await fs.readFile(RESET_FILE, 'utf-8');
    const list = JSON.parse(data);
    const now = Date.now();

    const match = list.find(
      (r) =>
        r.email === email &&
        r.tz === tz &&
        r.phone === phone &&
        new Date(r.expiresAt).getTime() > now
    );

    if (!match)
      return res.status(404).json({ message: "לא נמצאה סיסמה זמנית מתאימה" });

    res.json({
      temporaryPassword: match.newPassword,
      validUntil: match.expiresAt,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בשליפת סיסמה זמנית" });
  }
}

module.exports = {
  requestPasswordReset,
  getTemporaryPassword
};
