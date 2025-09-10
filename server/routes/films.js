const router = require("express").Router();
const ctrl = require('../controllers/filmController');

router.get('/', ctrl.index);
router.get('/:id', ctrl.show);

module.exports = router;