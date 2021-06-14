const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');
require('dotenv').config();

const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
const EmailService = require('../services/email');
const createFolderIsExist = require('../helpers/create-dir');

const SECRET_KEY = process.env.JWT_SECRET;


const register = async (req, res, next) => {
    try {
        const { email, name } = req.body;
        const user = await Users.findByEmail(email);
        if (user) {
            return res.status(HttpCode.CONFLICT).json({
                status: "error",
                code: HttpCode.CONFLICT,
                data: "Conflict",
                message: 'Email is already use'
            })
        }
        const verifyToken = nanoid();
        const emailService = new EmailService(process.env.NODE_ENV);
        await emailService.sendEmail(verifyToken, email, name);
        const newUser = await Users.create({ ...req.body, verify: false, verifyToken });
        return res.status(HttpCode.CREATED).json({
            status: 'success',
            code: HttpCode.CREATED,
            data: {
                email: newUser.email,
                subscription: newUser.subscription,
                avatarURL: newUser.avatarURL,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findByEmail(email);
        const isValidPassword = await user?.validPassword(password);
        if (!user || !isValidPassword || !user.verifyToken) {
            return res.status(HttpCode.UNAUTHORIZED).json({
                status: 'error',
                code: HttpCode.UNAUTHORIZED,
                message: 'Invalid credentials',
            });
        }
        const id = user._id;
        const payload = { id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
        await Users.updateToken(id, token);
        return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            data: {
                token,
                user: {
                    email: user.email,
                    subscription: user.subscription,
                    avatarURL: user.avatarURL,
                },
            },
        });
    } catch (error) {
        if (error.name === 'TypeError') {
            return next({
                status: HttpCode.BAD_REQUEST,
                message: 'Bad request',
            });
        }
        next(error);
    }
};

const logout = async (req, res, _next) => {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json();
};

const currentUser = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await Users.findById(id);
        return res.status(HttpCode.OK).json({
            status: 'success',
            code: HttpCode.OK,
            data: {
                user: {
                    email: user.email,
                    subscription: user.subscription,
                    avatarURL: user.avatarURL,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const updateSub = async (req, res, next) => {
    try {
        const id = req.user.id;
        const subscription = req.body.subscription;
        await Users.updateSubUser(id, subscription);
        const user = await Users.findById(id);
        return res.json({
            status: 'success',
            code: HttpCode.OK,
            data: {
                user: {
                    email: user.email,
                    subscription: user.subscription,
                    avatarURL: user.avatarURL,
                },
            },
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return next({
                status: HttpCode.NOT_FOUND,
                message: 'Not Found',
            });
        }
        next(error);
    }
};

const saveAvatarToStatic = async (req) => {
    const id = req.user.id;
    const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
    const pathFile = req.file.path;
    const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
    const img = await Jimp.read(pathFile);
    await img
        .autocrop()
        .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
        .writeAsync(pathFile)
    await createFolderIsExist(path.join(AVATARS_OF_USERS, id))
    await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar))
    const avatarUrl = path.normalize(path.join(id, newNameAvatar))
    try {
        await fs.unlink(
            path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarURL),
        )
    } catch (error) {
        console.log(error.message);
    }
    return avatarUrl;
};

const avatars = async (req, res, next) => {
    try {
        const id = req.user.id;
        const avatarUrl = await saveAvatarToStatic(req);
        await Users.updateAvatar(id, avatarUrl)
        return res.json({
            status: 'success',
            code: HttpCode.OK,
            data: {
                avatarUrl
            }
        })
    } catch (error) {
        next(error)
    }
};

const verify = async (req, res, next) => {
    try {
        const user = await Users.findByVerifyToken(req.params.token);
        if (user) {
            await Users.updateVerifyToken(user.id, true, null);
            return res.json({
                status: 'success',
                code: HttpCode.OK,
                message: 'Verification successful!'
            })
        }
        return res.status(HttpCode.BAD_REQUEST).json({
            status: 'error',
            code: HttpCode.BAD_REQUEST,
            data: 'Bad request',
            message: 'Link is not valid',
        });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    register,
    login,
    logout,
    currentUser,
    updateSub,
    avatars,
    verify
}