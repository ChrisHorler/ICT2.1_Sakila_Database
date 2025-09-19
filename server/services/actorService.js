const repo = require('../repositories/actorRepository');

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

    repo.count(q, (err, total) => {
        if (err) return cb(err);

        const pages = Math.max(1, Math.ceil(total / pageSize));
        if (page > pages) page = pages;
        const offset = (page - 1) * pageSize;

        repo.findAll({ limit: pageSize, offset, search: q }, (err2, rows) => {
            if (err2) return cb(err2);
            cb(null, { items: rows, total, page, pages, q, pager: buildPager(page, pages, 2) });
        });
    });
}

function getById(id, cb)   { repo.findById(id, cb); }
function create(data, cb)  { repo.create(data, cb); }
function update(id, d, cb) { repo.update(id, d, cb); }
function remove(id, cb)    { repo.remove(id, cb); }

function getDetails(id, cb) {
    repo.findById(id, (err, actor) => {
        if (err) return cb(err);
        if (!actor) return cb(null, null);
        repo.findFilmsByActor(id, (err2, films) => {
            if (err2) return cb(err2);
            cb(null, { actor, films });
        });
    });
}

module.exports = { list, getById, create, update, remove, getDetails };
