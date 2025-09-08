const pool = require('../config/db');

function listFilms(limit, offset, cb){
    const sql =
        'SELECT f.film_id, f.title, f.release_year, l.name AS language ' +
        'FROM film AS f ' +
        'INNER JOIN language AS l ON l.language_id = f.language_id ' +
        'ORDER BY f.title ' +
        'LIMIT ? OFFSET ?';


    pool.query(sql, [limit, offset], (error, rows) => {
        if (error)
            return cb(error);
        cb(null, rows);
    });
}

module.exports = { listFilms };