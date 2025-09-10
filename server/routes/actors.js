const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/actorController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', ctrl.index);
router.get('/:id',
    param('id').isInt({ min:1 }).withMessage('Invalid Id'),
    ctrl.show
);

router.get('/new', requireAuth(), requireRole(['staff', 'admin']), ctrl.newForm);
router.post('/',
    requireAuth(), requireRole(['staff', 'admin']),
    body('first_name').trim().isLength({ min:1, max:45 }).withMessage('First name is required (1–45 characters)'),
    body('last_name').trim().isLength({ min:1, max:45 }).withMessage('Last name is required (1–45 characters)'),
    ctrl.create
);
router.get('/:id/edit',
    requireAuth(), requireRole(['staff', 'admin']),
    param('id').isInt({min: 1}).withMessage('Invalid Id'),
    ctrl.editForm
);
router.post('/:id/update',
    requireAuth(), requireRole(['staff', 'admin']),
    param('id').isInt({min: 1}).withMessage('Invalid Id'),
    body('first_name').trim().isLength({min: 1, max: 45}).withMessage('First name is required (1–45 characters)'),
    body('last_name').trim().isLength({min: 1, max: 45}).withMessage('Last name is required (1-45 characters)'),
    ctrl.update
);
router.post('/:id/delete',
    requireAuth(), requireRole(['staff', 'admin']),
    param('id').isInt({min: 1}).withMessage('Invalid Id'),
    ctrl.destroy
);


module.exports = router;
