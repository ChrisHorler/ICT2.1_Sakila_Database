const express = require('express');
const router = express.Router();
const film = require('../controllers/filmController');

function requireLogin(req, res, next) {
    if (req.session && req.session.user) return next();
    const nextUrl = encodeURIComponent(req.originalUrl || '/films');
    return res.redirect('/auth/login?next=' + nextUrl);
}

router.get('/ajax/actors', requireLogin, film.ajaxActors);

router.get('/new', requireLogin, film.newForm);
router.post('/new', requireLogin, film.create);

router.get('/', film.index);
router.get('/:id', film.show);

router.get('/:id/edit', requireLogin, film.editForm);
router.post('/:id/edit', requireLogin, film.update);

router.post('/:id/delete', requireLogin, film.destroy);

module.exports = router;
