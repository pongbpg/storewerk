const router = require('express').Router();

var controllers = require('../controllers/accounts');

router.get('/', controllers.getById)
router.post('/', controllers.createAccount)
router.put('/', controllers.updateAccount)
router.get('/user', controllers.getByUser)
router.get('/years', controllers.getYears)
router.get('/months', controllers.getMonths)


module.exports = router;