const repo = require('../repositories/filmRepository');

function list(opts, cb) {
    const pageSize = 20;
    let page = parseInt(opts.page, 10);
    if (isNaN(page) || page < 1) page = 1;

    const q = (opts.q || '').trim();
    const category_id = opts.category_id ? parseInt(opts.category_id, 10) : null;
    const filters = { q, category_id };
    const offset = (page - 1) * pageSize;

    repo.count(filters, (err, total) => {
        if (err)
            return cb(err);

        repo.findAll({ limit: pageSize, offset, q, category_id }, (err2, items) => {
            if (err2)
                return cb(err2);
            const pages = Math.max(1, Math.ceil(total / pageSize));

            repo.listCategories((err3, cats) => {
                if (err3)
                    return cb(err3);

                cb(null, { items, total, page, pages, q, category_id, categories: cats });
            });
        });
    });
}

function details(id, cb) {
    const n = parseInt(id, 10);

    if (isNaN(n) || n < 1)
        return cb(null, null);

    repo.findDetails(n, cb);
}

module.exports = { list, details };
