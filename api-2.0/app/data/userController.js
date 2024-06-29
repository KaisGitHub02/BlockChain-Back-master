// controllers/userController.js
const bcrypt = require('bcrypt');
const db = require('../config/dbConfig');

exports.registerUser = async (req, res) => {
  const { dni, username, password } = req.body;

  if (!dni || !username || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (dni, username, password) VALUES (?, ?, ?)';
    const values = [dni, username, hashedPassword];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      res.status(201).json({ success: true, message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide username and password' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = generateToken(user); // Asume que tienes esta función
        res.json({ success: true, message: { token } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error comparing passwords:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
};

function generateToken(user) {
  // Implementa la generación de token según tu preferencia
  // Ejemplo usando JWT
  const jwt = require('jsonwebtoken');
  const payload = { id: user.id, username: user.username };
  const secret = 'your_jwt_secret'; // Cambia esto por una clave segura
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}
