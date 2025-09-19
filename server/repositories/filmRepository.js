const db = require('../config/db');

function doQuery(sql, params, cb){
    db.query(sql, params, function(err, rows){
        if (err) return cb(err);
        cb(null, rows);
    });
}

exports.getCategories = function(cb){
    doQuery('SELECT category_id, name FROM category ORDER BY name', [], cb);
};
exports.getLanguages = function(cb){
    doQuery('SELECT language_id, name FROM language ORDER BY name', [], cb);
};
exports.getAllActors = function(cb){
    doQuery('SELECT actor_id, first_name, last_name FROM actor ORDER BY last_name, first_name', [], cb);
};
exports.searchActors = function(q, limit, cb){
    const s = '%' + (q || '') + '%';
    doQuery(
        'SELECT actor_id, CONCAT(last_name, \', \', first_name) AS label FROM actor WHERE first_name LIKE ? OR last_name LIKE ? ORDER BY last_name, first_name LIMIT ?',
        [s, s, limit || 20],
        cb
    );
};

exports.list = function(opts, cb){
    const pageSize = opts.pageSize || 12;
    const page = Math.max(1, parseInt(opts.page || '1', 10));
    const q = (opts.q || '').trim();
    const category_id = opts.category_id ? parseInt(opts.category_id,10) : null;

    const where = [];
    const params = [];
    if (q) { where.push('f.title LIKE ?'); params.push('%' + q + '%'); }
    if (category_id) { where.push('fc.category_id = ?'); params.push(category_id); }
    const whereSql = where.length ? (' WHERE ' + where.join(' AND ')) : '';

    const countSql = `
      SELECT COUNT(*) AS cnt
      FROM film f
      LEFT JOIN film_category fc ON fc.film_id = f.film_id
      ${whereSql}
  `;
    doQuery(countSql, params, function(err, rows){
        if (err) return cb(err);
        const total = rows[0] ? rows[0].cnt : 0;
        const pages = Math.max(1, Math.ceil(total / pageSize));
        const offset = (page - 1) * pageSize;

        const sql = `
      SELECT f.film_id, f.title, f.description, f.rental_rate,
             l.name AS language, c.name AS category
      FROM film f
      JOIN language l ON l.language_id = f.language_id
      LEFT JOIN film_category fc ON fc.film_id = f.film_id
      LEFT JOIN category c ON c.category_id = fc.category_id
      ${whereSql}
      GROUP BY f.film_id
      ORDER BY f.title
      LIMIT ? OFFSET ?
    `;
        const p2 = params.slice();
        p2.push(pageSize, offset);
        doQuery(sql, p2, function(err2, items){
            if (err2) return cb(err2);
            cb(null, { items, page, pages });
        });
    });
};

exports.getByIdWithActors = function(id, cb){
    doQuery(
        `SELECT f.*, l.name AS language, c.category_id, c.name AS category
     FROM film f
     JOIN language l ON l.language_id = f.language_id
     LEFT JOIN film_category fc ON fc.film_id = f.film_id
     LEFT JOIN category c ON c.category_id = fc.category_id
     WHERE f.film_id = ?`,
        [id],
        function(err, rows){
            if (err) return cb(err);
            if (!rows.length) return cb(null, null);
            const film = rows[0];
            doQuery(
                `SELECT a.actor_id, a.first_name, a.last_name
         FROM film_actor fa
         JOIN actor a ON a.actor_id = fa.actor_id
         WHERE fa.film_id = ?
         ORDER BY a.last_name, a.first_name`,
                [id],
                function(err2, actors){
                    if (err2) return cb(err2);
                    film.actors = actors;
                    cb(null, film);
                }
            );
        }
    );
};

exports.create = function(data, cb){
    db.getConnection(function(err, conn){
        if (err) return cb(err);
        conn.beginTransaction(function(err1){
            if (err1) { conn.release(); return cb(err1); }

            const insFilm = `INSERT INTO film
        (title, description, language_id, rental_rate, release_year, rating, last_update)
        VALUES (?, ?, ?, ?, ?, ?, NOW())`;
            conn.query(
                insFilm,
                [data.title, data.description, data.language_id, data.rental_rate, data.release_year, data.rating],
                function(err2, r1){
                    if (err2) return rollback(conn, err2, cb);
                    const filmId = r1.insertId;

                    const insCat = 'INSERT INTO film_category (film_id, category_id, last_update) VALUES (?, ?, NOW())';
                    conn.query(insCat, [filmId, data.category_id], function(err3){
                        if (err3) return rollback(conn, err3, cb);

                        if (!data.actor_ids || !data.actor_ids.length) return commit(conn, cb, filmId);

                        const rows = data.actor_ids.map(aid => [aid, filmId]);
                        conn.query('INSERT INTO film_actor (actor_id, film_id) VALUES ?', [rows], function(err4){
                            if (err4) return rollback(conn, err4, cb);
                            commit(conn, cb, filmId);
                        });
                    });
                }
            );
        });
    });
};

exports.update = function(id, data, cb){
    db.getConnection(function(err, conn){
        if (err) return cb(err);
        conn.beginTransaction(function(err1){
            if (err1) { conn.release(); return cb(err1); }

            const upd = `UPDATE film
                   SET title=?, description=?, language_id=?, rental_rate=?, release_year=?, rating=?, last_update=NOW()
                   WHERE film_id=?`;
            conn.query(
                upd,
                [data.title, data.description, data.language_id, data.rental_rate, data.release_year, data.rating, id],
                function(err2){
                    if (err2) return rollback(conn, err2, cb);

                    conn.query('DELETE FROM film_category WHERE film_id=?', [id], function(err3){
                        if (err3) return rollback(conn, err3, cb);
                        conn.query('INSERT INTO film_category (film_id, category_id, last_update) VALUES (?, ?, NOW())',
                            [id, data.category_id],
                            function(err4){
                                if (err4) return rollback(conn, err4, cb);
                                conn.query('DELETE FROM film_actor WHERE film_id=?', [id], function(err5){
                                    if (err5) return rollback(conn, err5, cb);
                                    if (!data.actor_ids || !data.actor_ids.length) return commit(conn, cb, id);
                                    const rows = data.actor_ids.map(aid => [aid, id]);
                                    conn.query('INSERT INTO film_actor (actor_id, film_id) VALUES ?', [rows], function(err6){
                                        if (err6) return rollback(conn, err6, cb);
                                        commit(conn, cb, id);
                                    });
                                });
                            }
                        );
                    });
                }
            );
        });
    });
};

exports.destroy = function(id, cb){
    db.getConnection(function(err, conn){
        if (err) return cb(err);
        conn.beginTransaction(function(err1){
            if (err1) { conn.release(); return cb(err1); }

            const delPayments = `
        DELETE p FROM payment p
        JOIN rental r ON r.rental_id = p.rental_id
        JOIN inventory i ON i.inventory_id = r.inventory_id
        WHERE i.film_id = ?`;
            conn.query(delPayments, [id], function(err2){
                if (err2) return rollback(conn, err2, cb);

                conn.query('DELETE r FROM rental r JOIN inventory i ON i.inventory_id=r.inventory_id WHERE i.film_id=?', [id], function(err3){
                    if (err3) return rollback(conn, err3, cb);

                    conn.query('DELETE FROM inventory WHERE film_id=?', [id], function(err4){
                        if (err4) return rollback(conn, err4, cb);

                        conn.query('DELETE FROM film_actor WHERE film_id=?', [id], function(err5){
                            if (err5) return rollback(conn, err5, cb);

                            conn.query('DELETE FROM film_category WHERE film_id=?', [id], function(err6){
                                if (err6) return rollback(conn, err6, cb);

                                conn.query('DELETE FROM film WHERE film_id=?', [id], function(err7){
                                    if (err7) return rollback(conn, err7, cb);
                                    commit(conn, cb, true);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};


function rollback(conn, err, cb){ conn.rollback(function(){ conn.release(); cb(err); }); }
function commit(conn, cb, result){ conn.commit(function(err){ if (err) return rollback(conn, err, cb); conn.release(); cb(null, result); }); }
