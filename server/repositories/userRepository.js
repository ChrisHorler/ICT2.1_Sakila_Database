const pool = require('../config/db');

function findByUsername(username, cb) {
    const sql = 'SELECT user_id, username, password_hash, role, staff_id, customer_id FROM app_user WHERE username = ?';
    pool.query(sql, [username], (err, rows) => { if (err) return cb(err); cb(null, rows[0] || null); });
}

function findById (id, cb) {
    const sql = 'SELECT user_id, username, role, staff_id, customer_id FROM app_user WHERE user_id = ?';
    pool.query(sql, [id], (err, rows) => {
        if (err)
            return cb(err);

        cb(null, rows[0] || null);
    });
}

function createUser(u, cb) {
    const sql = 'INSERT INTO app_user (username, password_hash, role, staff_id, customer_id) VALUES (?, ?, ?, ?, ?)';
    const vals = [u.username, u.password_hash, u.role, u.staff_id || null, u.customer_id || null];
    pool.query(sql, vals, (err, result) => { if (err) return cb(err); cb(null, result.insertId); });
}

module.exports = { findByUsername, findById, createUser };
