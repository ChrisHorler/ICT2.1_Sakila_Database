const service = require('../services/actorService');

exports.index = (req, res, next) => {
    const { page, q } = req.query;

    service.list({ page, q }, (err, data) => {
        if (err) return next(err);

        const model = data || { items: [], total: 0, page: 1, pages: 1, q: '' };
        model.title = 'Actors';

        res.render('actors/index', model);
    });
};
