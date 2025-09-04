const express = require('express');
const router = express.Router();

// GET /
router.get('/', (req, res) => {
    res.render('home', { title: 'Test Site', heading: 'Welcome' });
});

// GET /about
router.get('/about', (req, res) => {
    res.render('about', { siteName: 'Test Site', description: 'Built with Express and ESJ!' });
});

module.exports = router;


