const svc = require('../services/filmService');

function pager(page, pages) {
    page = Math.max(1, parseInt(page || '1', 10));
    pages = Math.max(1, parseInt(pages || '1', 10));
    return { page, pages, hasPrev: page > 1, hasNext: page < pages, prev: Math.max(1, page - 1), next: Math.min(pages, page + 1) };
}
function filmsTpl(q, category_id) {
    const u = new URLSearchParams();
    if ((q || '').trim()) u.set('q', q.trim());
    if (category_id) u.set('category_id', category_id);
    u.set('page', '__p__');
    return '/films?' + u.toString();
}

exports.index = (req, res) => {
    const q = (req.query.q || '').trim();
    const category_id = req.query.category_id || '';
    const page = parseInt(req.query.page || '1', 10);

    svc.list({ q, category_id, page }, (err, out) => {
        if (err) return res.status(500).render('error', { error: err });
        res.render('films/index', {
            items: out.items || [],
            categories: out.categories || [],
            q, category_id,
            pager: pager(out.page, out.pages),
            pageUrlTemplate: filmsTpl(q, category_id),
            currentUser: req.session.user || null,
        });
    });
};

exports.show = (req, res) => {
    const id = parseInt(req.params.id, 10);
    svc.getByIdWithActors(id, (err, film) => {
        if (err) return res.status(500).render('error', { error: err });
        if (!film) return res.status(404).render('404');
        res.render('films/show', { film, currentUser: req.session.user || null });
    });
};

exports.newForm = (req, res) => {
    svc.getFormData((err, data) => {
        if (err) return res.status(500).render('error', { error: err });
        res.render('films/new', {
            languages: data.languages, categories: data.categories, actors: data.actors,
            errors: [],
            values: { title:'', description:'', language_id:'', category_id:'', rental_rate:'0.99', release_year:'', rating:'', actor_ids:[] },
            currentUser: req.session.user || null,
        });
    });
};

exports.create = (req, res) => {
    const payload = {
        title: (req.body.title || '').trim(),
        description: (req.body.description || '').trim(),
        language_id: parseInt(req.body.language_id || '0', 10) || null,
        category_id: parseInt(req.body.category_id || '0', 10) || null,
        rental_rate: parseFloat(req.body.rental_rate || '0') || 0,
        release_year: parseInt(req.body.release_year || '0', 10) || null,
        rating: (req.body.rating || '').trim() || null,
        actor_ids: Array.isArray(req.body.actor_ids) ? req.body.actor_ids.map(x => parseInt(x,10)).filter(Boolean) : []
    };

    svc.create(payload, (err, id) => {
        if (err && err.validation) {
            return svc.getFormData((e2, data) => {
                if (e2) return res.status(500).render('error', { error: e2 });
                res.status(400).render('films/new', { ...data, errors: err.validation, values: payload, currentUser: req.session.user || null });
            });
        }
        if (err) return res.status(500).render('error', { error: err });
        res.redirect('/films/' + id);
    });
};

exports.editForm = (req, res) => {
    const id = parseInt(req.params.id, 10);
    svc.getEditData(id, (err, out) => {
        if (err) return res.status(500).render('error', { error: err });
        if (!out) return res.status(404).render('404');
        res.render('films/edit', {
            film: out.film, languages: out.languages, categories: out.categories, actors: out.actors, selectedActorIds: out.selectedActorIds,
            errors: [], currentUser: req.session.user || null
        });
    });
};

exports.update = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const payload = {
        title: (req.body.title || '').trim(),
        description: (req.body.description || '').trim(),
        language_id: parseInt(req.body.language_id || '0', 10) || null,
        category_id: parseInt(req.body.category_id || '0', 10) || null,
        rental_rate: parseFloat(req.body.rental_rate || '0') || 0,
        release_year: parseInt(req.body.release_year || '0', 10) || null,
        rating: (req.body.rating || '').trim() || null,
        actor_ids: Array.isArray(req.body.actor_ids) ? req.body.actor_ids.map(x => parseInt(x,10)).filter(Boolean) : []
    };

    svc.update(id, payload, (err) => {
        if (err && err.validation) {
            return svc.getEditData(id, (e2, out) => {
                if (e2) return res.status(500).render('error', { error: e2 });
                res.status(400).render('films/edit', { ...out, errors: err.validation, currentUser: req.session.user || null });
            });
        }
        if (err) return res.status(500).render('error', { error: err });
        res.redirect('/films/' + id);
    });
};

exports.destroy = (req, res) => {
    const id = parseInt(req.params.id, 10);
    svc.destroy(id, (err) => {
        if (err) return res.status(500).render('error', { error: err });
        res.redirect('/films');
    });
};

exports.ajaxActors = (req, res) => {
    const q = (req.query.q || '').trim();
    svc.searchActors(q, 20, (err, items) => {
        if (err) return res.status(500).json({ ok:false, error:String(err) });
        res.json({ ok:true, items });
    });
};
