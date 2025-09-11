// server/middlewares/auth.js
exports.requireAuth = function () {
    return function (req, res, next) {
        if (req.session && req.session.user)
            return next();

        const nextUrl = encodeURIComponent(req.originalUrl || '/');

        console.log('[AUTH] not logged in ->', req.originalUrl, '=> /auth/login?next=' + nextUrl);
        res.status(302).set('Location', '/auth/login?next=' + nextUrl).end();
    };
};

exports.requireRole = function (roles) {
    const allowed = Array.isArray(roles) ? roles : [roles];

    return function (req, res, next) {
        const user = req.session && req.session.user;
        if (user && allowed.indexOf(user.role) !== -1)
            return next();

        console.log('[AUTH] forbidden', req.originalUrl, 'user=', user && user.username, 'role=', user && user.role, 'need=', allowed);
        res.status(403).render('error', { title: 'Forbidden', message: 'You have no access.', error: {} });
    };
};
