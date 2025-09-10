const {body, validationResult } = require('express-validator');
const authService = require('../services/authService');

exports.loginForm = (req, res) => {
    res.render('auth/login', {title: 'Login', errors: [], values: {username: '' }, nextUrl: req.query.next || ''});
};

exports.loginValidators = [
    body('username').trim().notEmpty().withMessage('Username is Required'),
    body('password').notEmpty().withMessage('Password is Required')
];


exports.login = (req, res, next) => {
    const errors = validationResult(req);
    const nextUrl = (req.body.next || '').trim();
    if (!errors.isEmpty()) {
        return res.status(400).render('auth/login', { title:'Login', errors: errors.array(), values:{ username: req.body.username || '' }, nextUrl });
    }
    authService.authenticate(req.body.username, req.body.password, (err, user) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).render('auth/login', {
                title:'Login', errors:[{ msg:'Onjuiste inloggegevens' }], values:{ username: req.body.username || '' }, nextUrl
            });
        }
        req.session.regenerate(() => { req.session.user = user; res.redirect(nextUrl || '/'); });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {res.clearCookie('sid'); res.redirect('/auth/login');});
};