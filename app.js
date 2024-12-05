const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRouter = require('./api/auth'); 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authRouter);  

app.get('/', (req, res) => {
  res.send('Welcome to the Express app deployed on Vercel!');
});

module.exports = app;
