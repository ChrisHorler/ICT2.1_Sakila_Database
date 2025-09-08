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

function create (data, cb) {
    const first = (data.first_name || '').trim();
    const last = (data.last_name || '').trim();

    return repo.create({first_name: first, last_name: last}, cb);
}

function getById(id, cb) {
    const n = parseInt (id, 10);
    if (isNaN(n) || n < 1)
        return cb (null, null);

    return repo.findById(n, cb);
}

module.exports = { list, create, getById };
