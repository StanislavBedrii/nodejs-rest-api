const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const contactsRouter = require('./routes/api/contacts');
const usersRouter = require('./routes/api/users');
const { createAccountLimiter } = require('./helpers/rate-limit-reg');
const { HttpCode } = require('./helpers/constants');
require('dotenv').config();

const app = express();

const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
app.use(express.static(path.join(__dirname, AVATARS_OF_USERS)));

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 })); // 10000 - bytes

app.use('/api/', createAccountLimiter);
app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found!' })
});

app.use((err, _req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: err.message })
});

module.exports = app;