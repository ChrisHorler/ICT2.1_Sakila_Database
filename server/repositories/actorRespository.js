const pool = require('../config/db');

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
        return cb(null, rows[0].cnt);
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
        return cb(null, rows);
    });
}

module.exports = { count, findAll };
