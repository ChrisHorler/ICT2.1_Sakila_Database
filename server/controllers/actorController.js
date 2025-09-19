const service = require('../services/actorService');
const { validationResult, param, body } = require('express-validator');

/**
 * GET /actors
 */
exports.index = (req, res, next) => {
    const { page, q } = req.query;
    service.list({ page, q }, (err, data) => {
        if (err) return next(err);
        const model = data || { items: [], total: 0, page: 1, pages: 1, q: '' };
        model.title = 'Actors';
        res.render('actors/index', model);
    });
};

/**
 * GET /actors/:id
 */
exports.show = (req, res, next) => {
    service.getById(req.params.id, (err, actor) => {
        if (err) return next(err);
        if (!actor) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Actor Not Found',
                error: {}
            });
        }
        res.render('actors/show', { title: `Actor #${actor.actor_id}`, actor });
    });
};

/**
 * GET /actors/new
 */
exports.newForm = (req, res) => {
    res.render('actors/new', { title: 'New Actor', errors: [], values: {} });
};

/**
 * POST /actors
 */
exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('actors/new', {
            title: 'New Actor',
            errors: errors.array(),
            values: req.body
        });
    }
    service.create(
        { first_name: req.body.first_name, last_name: req.body.last_name },
        (err, id) => {
            if (err) return next(err);
            return res.redirect(`/actors/${id}`);
        }
    );
};

/**
 * GET /actors/:id/edit
 */
exports.editForm = (req, res, next) => {
    service.getById(req.params.id, (err, actor) => {
        if (err) return next(err);
        if (!actor) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Actor Not Found',
                error: {}
            });
        }
        res.render('actors/edit', {
            title: `Edit Actor #${actor.actor_id}`,
            errors: [],
            values: actor,
            actor
        });
    });
};

/**
 * POST /actors/:id/update
 */
exports.update = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('actors/edit', {
            title: `Edit Actor #${req.params.id}`,
            errors: errors.array(),
            values: req.body,
            actor: { actor_id: req.params.id }
        });
    }
    service.update(
        req.params.id,
        { first_name: req.body.first_name, last_name: req.body.last_name },
        (err, ok) => {
            if (err) return next(err);
            if (!ok) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Actor Not Found',
                    error: {}
                });
            }
            return res.redirect(`/actors/${req.params.id}`);
        }
    );
};

/**
 * POST /actors/:id/delete
 */
exports.destroy = (req, res, next) => {
    service.remove(req.params.id, (err, ok) => {
        if (err) {
            const msg =
                err && err.errno == 1451
                    ? 'Unable to remove the actor: there are films related to this actor (film_actor).'
                    : 'Removing Actor Failed.';
            return res.status(400).render('error', {
                title: "Can't Remove",
                message: msg,
                error: {}
            });
        }
        if (!ok) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Actor Not Found',
                error: {}
            });
        }
        return res.redirect('/actors');
    });
};

exports.show = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    service.getDetails(id, (err, data) => {
        if (err)
            return next(err);
        if (!data)
            return res.status(404).render('error', { title: 'Not Found', message: 'Actor not found', error: {} });

        res.render('actors/show', {
            title: `Actor #${id}`,
            actor: data.actor,
            films: data.films
        });
    });
};

