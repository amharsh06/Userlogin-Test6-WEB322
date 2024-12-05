const express = require('express');
const helmet = require('helmet');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/', authRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
