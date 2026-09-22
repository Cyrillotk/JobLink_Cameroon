require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');

const connectDB = require('./config/db');
const { locals } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Request parsing and HTML-form support for PUT and DELETE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(locals);

// Routes
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));

// 404 then the central error handler, in that order.
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`JobLink running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Startup failed:', err.message);
    process.exit(1);
  });

module.exports = app;
