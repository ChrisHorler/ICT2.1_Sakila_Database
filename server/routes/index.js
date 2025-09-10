const router = require('express').Router();

router.get('/', (req, res) => {
    const qs = new URLSearchParams(req.query).toString();
    res.redirect(302, '/films' + (qs ? `?${qs}` : ''));
});

module.exports = router;
