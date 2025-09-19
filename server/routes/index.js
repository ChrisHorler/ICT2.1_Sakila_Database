const router = require('express').Router();
const svc = require('../services/homeService');

// GET /
router.get('/', function (req, res, next) {
    svc.getHomeModel(function (err, model) {
        if (err) return next(err);
        model = model || { stats: {}, featured: [] };
        model.title = 'Welcome';
        res.render('home', model);
    });
});

module.exports = router;
