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

module.exports = { list };
