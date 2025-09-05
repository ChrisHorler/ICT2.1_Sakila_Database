const filmRepo = require('../repositories/filmRepository');

function getHomeFilms(cb){
    const limit = 20;
    filmRepo.listFilms(limit, 0, cb);
};

module.exports = { getHomeFilms };