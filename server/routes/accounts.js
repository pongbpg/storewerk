const router = require('express').Router();

var controllers = require('../controllers/accounts');

router.get('/', controllers.getById)
router.post('/', controllers.createAccount)
router.put('/', controllers.updateAccount)
router.get('/user', controllers.getByUser)


module.exports = router;