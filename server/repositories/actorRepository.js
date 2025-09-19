const pool = require('../config/db');

function findFilmsByActor(actorId, cb) {
    const sql = `
    SELECT f.film_id, f.title, f.release_year, f.length, f.rating
    FROM film f
    JOIN film_actor fa ON fa.film_id = f.film_id
    WHERE fa.actor_id = ?
    ORDER BY f.title
  `;
    pool.query(sql, [actorId], (err, rows) => cb(err, rows || []));
}



function count(search, cb) {
    let sql = 'SELECT COUNT(*) AS cnt FROM actor';
    const params = [];
    if (search) {
        sql += ' WHERE first_name LIKE ? OR last_name LIKE ?';
        const like = `%${search}%`;
        params.push(like, like);
    }
    pool.query(sql, params, (err, rows) => {
        if (err) return cb(err);
        cb(null, rows[0].cnt);
    });
}

function findAll(opts, cb) {
    const { limit, offset, search } = opts;
    let sql = 'SELECT actor_id, first_name, last_name, last_update FROM actor';
    const params = [];
    if (search) {
        sql += ' WHERE first_name LIKE ? OR last_name LIKE ?';
        const like = `%${search}%`;
        params.push(like, like);
    }
    sql += ' ORDER BY last_name, first_name LIMIT ? OFFSET ?';
    params.push(limit, offset);

    pool.query(sql, params, (err, rows) => {
        if (err) return cb(err);
        cb(null, rows);
    });
}

function findById(id, cb) {
    const sql = 'SELECT actor_id, first_name, last_name, last_update FROM actor WHERE actor_id = ?';
    pool.query(sql, [id], (err, rows) => {
        if (err) return cb(err);
        cb(null, rows[0] || null);
    });
}

function create(data, cb) {
    const sql = 'INSERT INTO actor (first_name, last_name, last_update) VALUES (?, ?, NOW())';
    pool.query(sql, [data.first_name, data.last_name], (err, result) => {
        if (err) return cb(err);
        cb(null, result.insertId);
    });
}

function update(id, data, cb) {
    const sql = 'UPDATE actor SET first_name = ?, last_name = ?, last_update = NOW() WHERE actor_id = ?';
    pool.query(sql, [data.first_name, data.last_name, id], (err, result) => {
        if (err) return cb(err);
        cb(null, result.affectedRows > 0);
    });
}

function remove(id, cb) {
    const sql = 'DELETE FROM actor WHERE actor_id = ?';
    pool.query(sql, [id], (err, result) => {
        if (err) return cb(err);
        cb(null, result.affectedRows > 0);
    });
}

module.exports = { count, findAll, findById, create, update, remove, findFilmsByActor };
