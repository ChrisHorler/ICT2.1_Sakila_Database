const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');

exports.loginForm = function (req, res) {
    res.set('Cache-Control', 'no-store');
    res.render('auth/login', {
        title: 'Login',
        errors: [],
        values: { username: '' },
        nextUrl: req.query.next || ''
    });
};

exports.loginValidators = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

exports.login = function (req, res, next) {
    res.set('Cache-Control', 'no-store');
    const errors = validationResult(req);
    const nextUrl = (req.body.next || '').trim();

    if (!errors.isEmpty()) {
        return res.status(400).render('auth/login', {
            title: 'Login',
            errors: errors.array(),
            values: { username: req.body.username || '' },
            nextUrl
        });
    }

    authService.authenticate(req.body.username, req.body.password, function (err, user) {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).render('auth/login', {
                title: 'Login',
                errors: [{ msg: 'Invalid credentials' }],
                values: { username: req.body.username || '' },
                nextUrl
            });
        }

        req.session.regenerate(function (err2) {
            if (err2)
                return next(err2);

            req.session.user = user;
            req.session.save(function (err3) {
                if (err3)
                    return next(err3);

                return res.redirect(nextUrl || '/');
            });
        });
    });
};

exports.logout = function (req, res, next) {
    req.session.destroy(function (err) {
        if (err)
            return next(err);

        res.clearCookie('sid');
        res.redirect('/auth/login');
    });
};
