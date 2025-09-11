const service = require('../services/filmService');

exports.index = (req, res, next) => {
    service.list(req.query, (err, model) => {
        if (err) return next(err);
        model = model || { items: [], total: 0, page: 1, pages: 1, q: '', categories: [], pager: null };
        model.title = 'Films';
        res.render('films/index', model);
    });
};

exports.show = (req, res, next) => {
    service.getById(req.params.id, (err, film) => {
        if (err) return next(err);
        if (!film) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Film Not Found',
                error: {}
            });
        }
        res.render('films/show', { title: film.title, film });
    });
};
