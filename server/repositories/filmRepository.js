const pool = require('../config/db');

function count(filters, cb) {
    const params = [];
    const joins = [];
    const where = [];

    if (filters.category_id) {
        joins.push('LEFT JOIN film_category fc ON fc.film_id = f.film_id');
        where.push('fc.category_id = ?');
        params.push(parseInt(filters.category_id, 10));
    }
    if (filters.q) {
        where.push('f.title LIKE ?');
        params.push('%' + filters.q + '%');
    }

    let sql = 'SELECT COUNT(*) AS cnt FROM film f';
    if (joins.length)
        sql += ' ' + joins.join(' ');

    if (where.length)
        sql += ' WHERE ' + where.join(' AND ');

    pool.query(sql, params, (err, rows) => {
        if (err)
            return cb(err);
        cb(null, rows[0].cnt);
    });
}

function findAll(opts, cb) {
    const { limit, offset, q, category_id } = opts;

    const params = [];
    const joins = ['INNER JOIN language l ON l.language_id = f.language_id'];
    const where = [];

    if (category_id) {
        joins.push('INNER JOIN film_category fc ON fc.film_id = f.film_id');
        where.push('fc.category_id = ?');
        params.push(parseInt(category_id, 10));
    }
    if (q) {
        where.push('f.title LIKE ?');
        params.push('%' + q + '%');
    }

    let sql =
        'SELECT f.film_id, f.title, f.release_year, l.name AS language, f.length ' +
        'FROM film f ' + joins.join(' ');

    if (where.length)
        sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY f.title LIMIT ? OFFSET ?';

    params.push(limit, offset);

    pool.query(sql, params, (err, rows) => {
        if (err)
            return cb(err);
        cb(null, rows);
    });
}

function findDetails(id, cb) {
    const filmSql =
        'SELECT f.film_id, f.title, f.description, f.release_year, f.rating, f.length, l.name AS language ' +
        'FROM film f INNER JOIN language l ON l.language_id = f.language_id WHERE f.film_id = ?';

    pool.query(filmSql, [id], (err, rows) => {
        if (err) return cb(err);
        const film = rows[0] || null;
        if (!film) return cb(null, null);

        const catsSql =
            'SELECT c.category_id, c.name FROM category c ' +
            'INNER JOIN film_category fc ON fc.category_id = c.category_id ' +
            'WHERE fc.film_id = ? ORDER BY c.name';
        pool.query(catsSql, [id], (err2, cats) => {
            if (err2) return cb(err2);
            const actorsSql =
                'SELECT a.actor_id, a.first_name, a.last_name ' +
                'FROM actor a INNER JOIN film_actor fa ON fa.actor_id = a.actor_id ' +
                'WHERE fa.film_id = ? ORDER BY a.last_name, a.first_name';
            pool.query(actorsSql, [id], (err3, actors) => {
                if (err3) return cb(err3);
                cb(null, { film, categories: cats, actors });
            });
        });
    });
}

function listCategories(cb) {
    pool.query('SELECT category_id, name FROM category ORDER BY name', [], (err, rows) => {
        if (err)
            return cb(err);
        cb(null, rows);
    });
}

module.exports = {count, findAll, findDetails, listCategories}