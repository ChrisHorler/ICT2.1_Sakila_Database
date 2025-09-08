const service = require('../services/actorService');
const {validationResult } = require('express-validator');

exports.index = (req, res, next) => {
    const { page, q } = req.query;

    service.list({ page, q }, (err, data) => {
        if (err) return next(err);

        const model = data || { items: [], total: 0, page: 1, pages: 1, q: '' };
        model.title = 'Actors';

        res.render('actors/index', model);
    });
};

exports.newForm = (req, res) => {
    res.render('actors/new', {title: 'New Actor', errors: [], values: {}});
}

exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('actors/new', {
            title: 'New Actor',
            errors: errors.array(),
            values: req.body
        });
    }
    service.create({first_name: req.body.first_name, last_name: req.body.last_name}, (err, id) => {
        if (err)
            return next(err);
        return res.redirect(`/actors/${id}`);
    });
};


exports.show = (req, res, next) => {
    service.getById(req.params.id, (err, actor) => {
        if (err)
            return next(err);

        if (!actor)
            return res.status(404).render('error', { title: 'Not Found', message: 'Actor Not Found', error: {} });

        res.render('actors/show', { title: `Actor #${actor.actor_id}`, actor });
    });
};