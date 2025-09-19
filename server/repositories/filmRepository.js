const pool = require('../config/db');

/** COUNT with optional search and category filter */
function count(opts, cb) {
    var sql = 'SELECT COUNT(*) AS cnt FROM film f';
    var where = [];
    var params = [];

    if (opts.category_id) {
        sql += ' JOIN film_category fc ON fc.film_id = f.film_id';
        where.push('fc.category_id = ?');
        params.push(opts.category_id);
    }
    if (opts.q) {
        where.push('(f.title LIKE ? OR f.description LIKE ?)');
        var like = '%' + opts.q + '%';
        params.push(like, like);
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');

    pool.query(sql, params, function (err, rows) {
        if (err) return cb(err);
        return cb(null, rows[0].cnt);
    });
}

/** LIST – all fields needed for the catalogue rows */
function findAll(opts, cb) {
    var sql = 'SELECT f.film_id, f.title, f.description, f.release_year, ' +
        'f.length, f.rental_rate, l.name AS language ' +
        'FROM film f ' +
        'JOIN language l ON l.language_id = f.language_id ';
    var where = [];
    var params = [];

    if (opts.category_id) {
        sql += 'JOIN film_category fc ON fc.film_id = f.film_id ';
        where.push('fc.category_id = ?');
        params.push(opts.category_id);
    }
    if (opts.q) {
        where.push('(f.title LIKE ? OR f.description LIKE ?)');
        var like = '%' + opts.q + '%';
        params.push(like, like);
    }
    if (where.length) sql += 'WHERE ' + where.join(' AND ') + ' ';

    sql += 'ORDER BY f.title LIMIT ? OFFSET ?';
    params.push(opts.limit, opts.offset);

    pool.query(sql, params, function (err, rows) {
        if (err) return cb(err);
        return cb(null, rows);
    });
}

/** DETAILS – used on film detail page */
function findById(id, cb) {
    var sql = 'SELECT f.film_id, f.title, f.description, f.release_year, ' +
        'f.length, f.rental_rate, l.name AS language ' +
        'FROM film f JOIN language l ON l.language_id = f.language_id ' +
        'WHERE f.film_id = ?';
    pool.query(sql, [id], function (err, rows) {
        if (err) return cb(err);
        return cb(null, rows[0] || null);
    });
}

function listCategories(cb) {
    pool.query('SELECT category_id, name FROM category ORDER BY name', [], function (err, rows) {
        if (err) return cb(err);
        return cb(null, rows);
    });
}

module.exports = { count, findAll, findById, listCategories };
