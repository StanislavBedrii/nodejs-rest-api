const passport = require('passport');
require('../config/passport');
const { HttpCode } = require('./constants');

const guard = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        const header = req.get('Authorization');
        if (!header) {
            return next({
                status: HttpCode.UNAUTHORIZED,
                message: 'Not authorized',
            });
        }
        const token = header?.split(' ')[1];
        if (!user || err || token !== user.token) {
            return res.status(HttpCode.FORBIDDEN).json({
                status: 'error',
                code: HttpCode.FORBIDDEN,
                data: 'Forbidden',
                message: 'Access is denied',
            });
        }
        req.user = user;
        return next();
    })(req, res, next);
};

module.exports = guard;