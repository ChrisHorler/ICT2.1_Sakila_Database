const router = require("express").Router();
const filmService = require("../services/filmService");

router.get("/", (req, res, next)=>{
    filmService.getHomeFilms((error, films)=>{
        if(error)
            return next(error);
        res.render('home', {title: 'Home Page', films});
    });
});

module.exports = router;
