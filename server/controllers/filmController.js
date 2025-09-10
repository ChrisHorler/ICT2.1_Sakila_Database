const service = require('../services/filmService');

exports.index = (req, res, next) => {
    const { page, q, category_id } = req.query;

    service.list({ page, q, category_id }, (err, data) => {
        if (err) return next(err);

        const model = data || { items: [], total: 0, page: 1, pages: 1, q: '', category_id: null, categories: [] };
        model.title = 'Films';

        res.render('films/index', model);
    });
};

exports.show = (req, res, next) => {
    service.details(req.params.id, (err, data) => {
        if (err) return next(err);
        if (!data) return res.status(404).render('error', { title: 'Not Found', message: 'Film niet gevonden', error: {} });
        res.render('films/show', { title: data.film.title, data });
    });
};
