const express = require('express');
const router = express.Router();

const usersController = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');
const { createAccountLimiter } = require('../../../helpers/rate-limit-reg');
const validate = require("./validation");

router.post('/auth/register', createAccountLimiter, validate.register, usersController.register);

router.post('/auth/login', validate.login, usersController.login);

router.post('/auth/logout', guard, usersController.logout);

router.get('/current', guard, usersController.currentUser);

router.patch('/current', guard, validate.updateSub, usersController.updateSub);

router.patch('/avatars', [guard, upload.single('avatar'), validate.uploadAvatar], usersController.avatars);

router.get('/verify/:token', usersController.verify)

module.exports = router;
