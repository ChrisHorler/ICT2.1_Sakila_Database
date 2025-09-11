const repo = require('../repositories/filmRepository');

function buildPager(page, pages, radius) {
    const items = [];
    const start = Math.max(1, page - radius);
    const end   = Math.min(pages, page + radius);

    if (start > 1) { items.push(1); if (start > 2) items.push('…'); }
    for (let p = start; p <= end; p++) items.push(p);
    if (end < pages) { if (end < pages - 1) items.push('…'); items.push(pages); }

    return {
        page, pages,
        hasPrev: page > 1,
        hasNext: page < pages,
        prev: Math.max(1, page - 1),
        next: Math.min(pages, page + 1),
        items
    };
}

function list(opts, cb) {
    const pageSize = 20;
    let page = parseInt(opts.page, 10);
    if (isNaN(page) || page < 1) page = 1;

    const q = (opts.q || '').trim();
    const category_id = opts.category_id ? parseInt(opts.category_id, 10) : null;

    repo.count({ q, category_id }, (err, total) => {
        if (err) return cb(err);

        const pages = Math.max(1, Math.ceil(total / pageSize));
        if (page > pages) page = pages;
        const offset = (page - 1) * pageSize;

        repo.findAll({ limit: pageSize, offset, q, category_id }, (err2, rows) => {
            if (err2) return cb(err2);
            repo.listCategories((err3, cats) => {
                if (err3) return cb(err3);
                cb(null, {
                    items: rows,
                    total,
                    page,
                    pages,
                    q,
                    category_id,
                    categories: cats,
                    pager: buildPager(page, pages, 2)
                });
            });
        });
    });
}

function getById(id, cb) { repo.findById(id, cb); }

module.exports = { list, getById };
