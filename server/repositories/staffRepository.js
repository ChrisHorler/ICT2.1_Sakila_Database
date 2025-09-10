const pool = require('../config/db');

function findByUsername(username, cb) {
    const sql = `
    SELECT staff_id, username, password, first_name, last_name, store_id, active
    FROM staff
    WHERE username = ?
    LIMIT 1
  `;

    pool.query(sql, [username], function (err, rows){
        if (err)
            return cb(err);

        cb(null, rows[0] || null);
    });
}

function findById(id, cb) {
    const sql = `
    SELECT staff_id, username, password, first_name, last_name, store_id, active
    FROM staff
    WHERE username = ?
    LIMIT 1
  `;

    pool.query(sql, [id], function (err, rows){
        if (err)
            return cb(err);
        cb(null, rows[0] || null);
    });
}

module.exports = { findByUsername, findById };