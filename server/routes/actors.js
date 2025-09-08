const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/actorController');

router.get('/', ctrl.index);

router.get('/new', ctrl.newForm);

router.post('/',
    body('first_name').trim().isLength({ min:1, max:45 }).withMessage('First name is required (1–45 characters)'),
    body('last_name').trim().isLength({ min:1, max:45 }).withMessage('Last name is required (1–45 characters)'),
    ctrl.create
);

router.get('/:id',
    param('id').isInt({ min:1 }).withMessage('Invalid Id'),
    ctrl.show
);

module.exports = router;
