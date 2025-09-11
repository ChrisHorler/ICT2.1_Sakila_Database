const pool = require('../config/db');

/**
 * Count films with optional search and category filter
 */
function count(opts, cb) {
    const q = (opts.q || '').trim();
    const category_id = opts.category_id ? parseInt(opts.category_id, 10) : null;

    let sql =
        'SELECT COUNT(DISTINCT f.film_id) AS cnt ' +
        'FROM film f ' +
        'LEFT JOIN film_category fc ON fc.film_id = f.film_id ';
    const params = [];

    const where = [];
    if (q) {
        where.push('(f.title LIKE ?)');
        params.push(`%${q}%`);
    }
    if (category_id) {
        where.push('fc.category_id = ?');
        params.push(category_id);
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');

    pool.query(sql, params, (err, rows) => {
        if (err) return cb(err);
        cb(null, rows[0].cnt);
    });
}

/**
 * Find films page with optional filters
 */
function findAll(opts, cb) {
    const { limit, offset } = opts;
    const q = (opts.q || '').trim();
    const category_id = opts.category_id ? parseInt(opts.category_id, 10) : null;

    let sql =
        'SELECT f.film_id, f.title, f.release_year, l.name AS language ' +
        'FROM film f ' +
        'JOIN language l ON l.language_id = f.language_id ' +
        'LEFT JOIN film_category fc ON fc.film_id = f.film_id ';
    const params = [];

    const where = [];
    if (q) { where.push('f.title LIKE ?'); params.push(`%${q}%`); }
    if (category_id) { where.push('fc.category_id = ?'); params.push(category_id); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');

    sql += ' GROUP BY f.film_id, f.title, f.release_year, l.name ';
    sql += ' ORDER BY f.title LIMIT ? OFFSET ?';
    params.push(limit, offset);

    pool.query(sql, params, (err, rows) => {
        if (err) return cb(err);
        cb(null, rows);
    });
}

/**
 * Single film by id
 */
function findById(id, cb) {
    const sql =
        'SELECT f.*, l.name AS language ' +
        'FROM film f ' +
        'JOIN language l ON l.language_id = f.language_id ' +
        'WHERE f.film_id = ?';
    pool.query(sql, [id], (err, rows) => {
        if (err) return cb(err);
        cb(null, rows[0] || null);
    });
}

/**
 * Categories list for the filter
 */
function listCategories(cb) {
    pool.query('SELECT category_id, name FROM category ORDER BY name', [], (err, rows) => {
        if (err) return cb(err);
        cb(null, rows);
    });
}

module.exports = { count, findAll, findById, listCategories };
