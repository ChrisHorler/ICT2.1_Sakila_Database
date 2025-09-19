const repo = require('../repositories/filmRepository');

const PAGE_SIZE = 12;

exports.list = function(params, cb){
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const q = (params.q || '').trim();
    const category_id = params.category_id ? parseInt(params.category_id, 10) : null;

    repo.getCategories(function(err, categories){
        if (err) return cb(err);
        repo.list({ q, category_id, page, pageSize: PAGE_SIZE }, function(err2, data){
            if (err2) return cb(err2);
            cb(null, {
                items: data.items, page: data.page, pages: data.pages,
                categories
            });
        });
    });
};

exports.getByIdWithActors = function(id, cb){
    repo.getByIdWithActors(id, cb);
};

exports.getFormData = function(cb){
    repo.getLanguages(function(err, languages){
        if (err) return cb(err);
        repo.getCategories(function(err2, categories){
            if (err2) return cb(err2);

            repo.getAllActors(function(err3, actors){
                if (err3) return cb(err3);
                cb(null, { languages, categories, actors });
            });
        });
    });
};

exports.getEditData = function(id, cb){
    repo.getByIdWithActors(id, function(err, film){
        if (err) return cb(err);
        if (!film) return cb(null, null);
        exports.getFormData(function(err2, form){
            if (err2) return cb(err2);
            const selectedActorIds = (film.actors || []).map(a => a.actor_id);
            cb(null, { film, languages: form.languages, categories: form.categories, actors: form.actors, selectedActorIds });
        });
    });
};

exports.create = function(payload, cb){
    const errors = validateFilm(payload);
    if (errors.length) return cb({ validation: errors });
    repo.create(payload, cb);
};

exports.update = function(id, payload, cb){
    const errors = validateFilm(payload);
    if (errors.length) return cb({ validation: errors });
    repo.update(id, payload, cb);
};

exports.destroy = function(id, cb){
    repo.destroy(id, cb);
};

exports.searchActors = function(q, limit, cb){
    repo.searchActors(q, limit, cb);
};

function validateFilm(v){
    const errors = [];
    if (!v.title) errors.push('Title is required.');
    if (!v.language_id) errors.push('Language is required.');
    if (!v.category_id) errors.push('Category is required.');
    if (v.release_year && (String(v.release_year).length !== 4 || isNaN(v.release_year))) {
        errors.push('Release year must be a 4-digit number.');
    }
    if (v.rental_rate < 0) errors.push('Rental rate must be >= 0.');
    return errors;
}
