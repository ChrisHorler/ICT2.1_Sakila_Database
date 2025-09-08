const repo = require('../repositories/actorRespository');

function list(opts, cb) {
    const pageSize = 20;
    let page = parseInt(opts.page, 10);
    if (isNaN(page) || page < 1) page = 1;

    const q = (opts.q || '').trim();
    const offset = (page - 1) * pageSize;

    repo.count(q, function onCount(err, total) {
        if (err) return cb(err);

        repo.findAll({ limit: pageSize, offset, search: q }, function onList(err2, items) {
            if (err2) return cb(err2);

            const pages = Math.max(1, Math.ceil(total / pageSize));
            const model = { items, total, page, pages, q };
            return cb(null, model);
        });
    });
}

function getById(id, cb) {
    const n = parseInt (id, 10);
    if (isNaN(n) || n < 1)
        return cb (null, null);

    return repo.findById(n, cb);
}

function getDetails(id, cb){
    const n = parseInt(id, 10);
    if (isNaN(n) || n < 1)
        return cb(null, {actor:null, filmCount:0});

    repo.findById(n, (err, actor) => {
        if(err)
            return cb(err);

        if(!actor)
            return cb(null, {actor:null, filmCount:0});

        repo.countFilmLinks(n, (err2, count) => {
            if(err2)
                return cb(err2);

            cb(null, {actor, filmCount: count});
        });
    });
}

function removeIfNoLinks(id, cb) {
    const n = parseInt(id, 10);
    if (isNaN(n) || n < 1)
        return cb(null, false);

    repo.countFilmLinks(n, (err, count) => {
        if(err)
            return cb(err);
        if (count > 0)
            return cb({code: 'HAS_LINKS', count});

        return repo.remove(n,cb);
    });
}

function create (data, cb) {
    const first = (data.first_name || '').trim();
    const last = (data.last_name || '').trim();

    return repo.create({first_name: first, last_name: last}, cb);
}

function update (id, data, cb) {
    const n = parseInt (id, 10);

    if (isNaN(n) || n < 1)
        return cb(null, false);

    const first = (data.first_name || '').trim();
    const last = (data.last_name || '').trim();

    repo.update(n, {first_name: first, last_name: last}, cb);
}

function remove (id, cb) {
    const n = parseInt (id, 10);

    if (isNaN(n) || n < 1)
        return cb(null, false);

    repo.remove(n, cb);
}

module.exports = { list, getById, create, update, remove, getDetails, removeIfNoLinks };
