const pool = require('../config/db');

function getCounts(cb) {
    const sqls = [
        'SELECT COUNT(*) AS cnt FROM film',
        'SELECT COUNT(*) AS cnt FROM actor',
        'SELECT COUNT(*) AS cnt FROM customer',
        'SELECT COUNT(*) AS cnt FROM rental'
    ];

    const stats = { films: 0, actors: 0, customers: 0, rentals: 0};

    pool.query(sqls[0], [], function (e1, r1) {
        if (e1)
            return cb(e1);
        stats.films = r1[0].cnt;

        pool.query(sqls[1], [], function (e2, r2) {
            if (e2)
                return cb(e2);
            stats.actors = r2[0].cnt;

            pool.query(sqls[2], [], function (e3, r3) {
                if (e3)
                    return cb(e3);
                stats.customers = r3[0].cnt;

                pool.query(sqls[3], [], function (e4, r4) {
                    if (e4)
                        return cb(e4);
                    stats.rentals = r4[0].cnt;

                    return cb(null, stats);
                });
            });
        });
    });
}

function getFeatured(cb) {
    const sql = 'SELECT f.film_id, f.title, f.release_year, l.name AS language ' +
        'FROM film f JOIN language l ON l.language_id = f.language_id ' +
        'ORDER BY RAND() LIMIT 6';

    pool.query(sql, [], function (err, rows) {
        if (err)
            return cb(err);

        return cb(null, rows || []);
    });
}

function getHomeModel(cb) {
    getCounts(function (err, stats) {
        if (err)
            return cb(err);

        getFeatured(function (err2, featured){
            if(err2)
                return cb(err2);
            cb (null, {
                stats: stats, featured: featured
            });
        });
    });
}

module.exports = {getHomeModel};