const router = require('express').Router();
const ctrl = require('../controllers/actorController');

router.get('/', ctrl.index);

module.exports = router;
