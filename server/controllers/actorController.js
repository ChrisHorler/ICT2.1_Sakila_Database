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
    service.getDetails(req.params.id, (err, data) => {
        if (err) return next(err);
        if (!data.actor) {
            return res.status(404).render('error', { title:'Not Found', message:'Actor Not Found', error:{} });
        }
        res.render('actors/show', { title:`Actor #${data.actor.actor_id}`, actor: data.actor, filmCount: data.filmCount });
    });
};


exports.editForm = (req, res, next) => {
    service.getById(req.params.id, (err, actor) => {
        if (err) return next(err);
        if (!actor) return res.status(404).render('error', { title:'Not Found', message:'Actor Not Found', error:{} });
        res.render('actors/edit', { title: `Edit Actor #${actor.actor_id}`, errors: [], values: actor, actor });
    });
};

exports.update = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).render('actors/edit', {
            title: `Edit Actor #${req.params.id}`,
            errors: errors.array(),
            values: req.body,
            actor: { actor_id: req.params.id }
        });
    }

    service.update(req.params.id, {first_name: req.body.first_name, last_name: req.body.last_name}, (err, ok) => {
        if (err)
            return next(err);

        if (!ok)
            return res.status(404).render('error', { title:'Not Found', message:'Actor Not Found', error:{}});

        return res.redirect(`/actors/${req.params.id}`);
    });
};

exports.destroy = (req, res, next) => {
    service.removeIfNoLinks(req.params.id, (err, ok) => {
        if (err) {
            if (err.code === 'HAS_LINKS') {
                return res.status(400).render('error', {
                    title: "Kan niet verwijderen",
                    message: `Deze actor komt voor in ${err.count} film(en). Verwijder eerst de relaties (film_actor).`,
                    error: {}
                });
            }
            return res.status(400).render('error', { title:"Kan niet verwijderen", message:'Verwijderen mislukt.', error:{} });
        }
        if (!ok) return res.status(404).render('error', { title:'Not Found', message:'Actor niet gevonden', error:{} });
        return res.redirect('/actors');
    });
};