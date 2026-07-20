const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const SALT_ROUNDS = 10;
const SECRET_KEY =process.env.SECRET_KEY;
const attempts = {};
const USERS_FILE = path.join(__dirname, '../data/users.json');

function normalizePhone(phone) {
  return phone?.toString().replace(/\s|-/g, '').replace(/^(\+972|972)/, '0').trim();
}

async function getAll(req, res) {
  try {
    const data = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(data);
    const safeUsers = users.map(u => ({ ...u, password: undefined }));
    res.status(200).json(safeUsers);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקריאת קובץ המשתמשים" });
  }
}

async function getById(req, res) {
  const id = req.params.id;
  try {
    const data = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(data);
    const user = users.find(u => u.id == id);
    if (!user) return res.status(404).json({ message: `משתמש עם ID ${id} לא נמצא` });
    const { password, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בקריאת קובץ המשתמשים" });
  }
}

async function getByEmail(req, res) {
  const email = req.params.email;
  try {
    const data = await fs.readFile("./data/users.json", "utf-8");
    console.log(data);  // לוודא שהנתונים נטענים כראוי

    const users = JSON.parse(data);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: `משתמש עם האימייל ${email} לא נמצא` });
    const { password, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשליפת משתמש לפי אימייל" });
  }
}

async function getByTz(req, res) {
  const tz = req.params.tz;
  try {
    const data = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(data);
    const user = users.find(u => u.tz === tz);
    if (!user) return res.status(404).json({ message: `משתמש עם תעודת זהות ${tz} לא נמצא` });
    const { password, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשליפת משתמש לפי תעודת זהות" });
  }
}

async function addUser(req, res) {
  const { username, tz, email, telephone, password } = req.body;
  try {
    const data = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(data);
    const normalizedPhone = normalizePhone(telephone);
    const exists = users.find(u =>
      u.email === email || u.tz === tz || normalizePhone(u.telephone) === normalizedPhone
    );

console.log('משתמש שנמצא:', exists);
    console.log('פרטים שנשלחו:', { username, tz, email, telephone });

    if (exists) return res.status(400).json({ message: "משתמש כבר קיים" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username,
      tz,
      email,
      telephone,
      password: hashedPassword,
      role: 'user'
    };

    users.push(newUser);
    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
    const { password: _, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בהוספת משתמש" });
  }
}

async function register(req, res) {
  const ip = req.ip;
  const now = Date.now();
  const { username, tz, email, telephone, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (attempts[ip] && attempts[ip].count >= 5 && now - attempts[ip].last < 180000) {
    return res.status(429).json({ message: "נחסמת זמנית – נסה בעוד 3 דקות" });
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "כתובת מייל לא תקינה" });
  }

  try {
    const data = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(data);
    const normalizedPhone = normalizePhone(telephone);

    const exists = users.find(u =>
      u.email === email || u.tz === tz || normalizePhone(u.telephone) === normalizedPhone
    );
    if (exists) {
      if (!attempts[ip]) attempts[ip] = { count: 1, last: now };
      else {
        attempts[ip].count++;
        attempts[ip].last = now;
      }
      return res.status(400).json({ message: "אימייל, תעודת זהות או טלפון כבר קיימים" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username,
      tz,
      email,
      telephone,
      password: hashedPassword,
      role: 'user'
    };

    users.push(newUser);
    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: "נרשמת בהצלחה!", user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "שגיאה ברישום", error: err.message });
  }
}

// login.js
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(data);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "סיסמה שגויה" });
    }

    // יוצרים טוקן JWT כולל role (ברירת מחדל 'user') ו־id
    const token = jwt.sign(
      { id: user.id, role: user.role || 'user', email: user.email, username: user.username },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    // שומרים את הטוקן כ־HTTP Only Cookie
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      secure: false,         // ב־localhost מותר false
      maxAge: 2 * 60 * 60 * 1000
    });

    // מוחקים את שדה הסיסמה לפני שליחה ללקוח
    const { password: _, ...safeUser } = user;

    // מחזירים תשובה עם מידע על האם הסיסמה זמנית + הטוקן ✅ שינוי יחיד!
    return res.status(200).json({
      token, // ← הוספה קריטית לפי בקשתך
      message: user.isTemporary
        ? "התחברת עם סיסמה זמנית. יש לעדכן אותה כעת"
        : "התחברת בהצלחה",
      user: safeUser
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "שגיאה בהתחברות" });
  }
}


async function changePassword(req, res) {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: "יש לספק אימייל וסיסמה חדשה" });
  }

  try {
    const data = await fs.readFile('./data/users.json', 'utf-8');
    const users = JSON.parse(data);
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: "משתמש לא נמצא" });

    try {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: "הסיסמה החדשה זהה לקודמת" });
      }
    } catch (err) {
      console.warn("⚠️ סיסמה קודמת לא הייתה בפורמט מוצפן – נמשיך בכל זאת");
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.isTemporary = false;

    await fs.writeFile('./data/users.json', JSON.stringify(users, null, 2));

    const resetData = await fs.readFile('./data/reset_requests.json', 'utf-8');
    let resetRequests = JSON.parse(resetData);
    resetRequests = resetRequests.filter(r => r.email !== email);
    await fs.writeFile('./data/reset_requests.json', JSON.stringify(resetRequests, null, 2));

    return res.status(200).json({ message: "הסיסמה שונתה בהצלחה" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "שגיאה בשינוי הסיסמה" });
  }
}


async function update(req, res) {
  const id = req.params.id;
  const updatedUser = req.body;
  try {
    const data = await fs.readFile("./data/users.json", 'utf-8');
    const users = JSON.parse(data);
    const index = users.findIndex(u => u.id == id);
    if (index === -1) return res.status(404).json({ message: "משתמש לא נמצא" });

    updatedUser.password = updatedUser.password
      ? await bcrypt.hash(updatedUser.password, SALT_ROUNDS)
      : users[index].password;

    delete updatedUser.role;

    users[index] = { ...users[index], ...updatedUser, id: parseInt(id) };
    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
    const { password, ...safeUser } = users[index];
    res.status(200).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון משתמש" });
  }
}

async function patchUser(req, res) {
  const { id } = req.params;
  const updates = req.body;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'לא סופקו שינויים' });
  }
  try {
    const data = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(data);
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return res.status(404).json({ message: 'משתמש לא נמצא' });

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    delete updates.role;

    users[index] = { ...users[index], ...updates, id: parseInt(id) };
    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
    const { password, ...safeUser } = users[index];
    res.status(200).json({ message: 'עודכן בהצלחה', user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בעדכון חלקי" });
  }
}

async function deleteUser(req, res) {
  const id = req.params.id;
  try {
    const data = await fs.readFile("./data/users.json", "utf-8");
    const users = JSON.parse(data);
    const index = users.findIndex(u => u.id == id);
    if (index === -1) return res.status(404).json({ message: "משתמש לא נמצא" });

    const deletedUser = users.splice(index, 1)[0];
    await fs.writeFile("./data/users.json", JSON.stringify(users, null, 2));
    const { password, ...safeUser } = deletedUser;
    res.status(200).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: "שגיאה במחיקת משתמש" });
  }
}


async function getUserFromToken(req, res) {
  // שליפת הטוקן מהקוקי
  const token = req.cookies.token;
  
  // אם אין טוקן בקוקי
  if (!token) {
    return res.status(401).json({ message: 'אין טוקן - גישה נדחתה' });
  }

  // אימות הטוקן
  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'טוקן לא תקין' });
    }

    // שליפת המידע מהטוקן
    const userId = decoded.id; // הנח כי הטוקן מכיל את המזהה של המשתמש

    try {
      // קריאת כל המשתמשים מקובץ ה־JSON
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      const users = JSON.parse(data);

      // חיפוש המשתמש לפי ID
      const user = users.find(u => u.id === userId);
      if (!user) return res.status(404).json({ message: 'משתמש לא נמצא' });

      // הסרת הסיסמה מהמשתמש לפני שליחה ללקוח
      const { password, ...safeUser } = user;

      // מחזירים את המידע על המשתמש
      res.status(200).json({ user: safeUser });
    } catch (err) {
      console.error('שגיאה בשליפת המשתמש:', err);
      res.status(500).json({ message: 'שגיאה בשרת' });
    }
  });
}



module.exports = {
  getAll,
  getById,
  getByEmail,
  getByTz,
  addUser,
  register,
  login,
  update,
  patchUser,
  changePassword,
  deleteUser,
  getUserFromToken
};
