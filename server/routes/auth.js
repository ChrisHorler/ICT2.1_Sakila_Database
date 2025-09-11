const router = require('express').Router();
const ctrl = require('../controllers/authController');

router.get('/login', ctrl.loginForm);
router.post('/login', ctrl.loginValidators, ctrl.login);
router.post('/logout', ctrl.logout);

module.exports = router;
