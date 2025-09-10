exports.requireAuth = () => (req, res, next) => {
    if(req.session && req.session.user)
        return next();

    const nextUrl = encodeURIComponent(req.originalUrl || '/');
    res.redirect('/auth/login?next=' + nextUrl);
};

exports.requireRole = (roles) => {
    const allowed = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
        if (req.session && req.session.user && allowed.indexOf(req.session.user) !== -1) {
            res.status(403).render('error', {title: 'Forbidden', message:'You have no access', error:{} });
        }
    };
};