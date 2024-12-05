const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');

const router = express.Router();


const users = [];


router.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);


router.get('/register', (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form action="/register" method="POST">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required><br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br>
      <button type="submit">Register</button>
    </form>
  `);
});


router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Username, email, and password are required.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, email, password: hashedPassword });
    res.send('Registration successful! You can now <a href="/login">login</a>.');
  } catch (error) {
    res.status(500).send('Error registering user.');
  }
});


router.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="POST">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br>
      <button type="submit">Login</button>
    </form>
  `);
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(400).send('Invalid username or password.');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).send('Invalid username or password.');
  }

  req.session.user = user;
  res.send('Login successful! Go to <a href="/dashboard">dashboard</a>.');
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.send(`
    <h1>Welcome, ${req.session.user.username}!</h1>
    <p>Email: ${req.session.user.email}</p>
    <a href="/logout">Logout</a>
  `);
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out.');
    }
    res.redirect('/login');
  });
});



router.get('/users', (req, res) => {
    res.json(users);  
  });

module.exports = router;
