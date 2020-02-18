const router = require('express').Router();

var controllers = require('../controllers/warehouses');

router.get('/', controllers.getById)
router.get('/account', controllers.getByAccountId)
router.post('/', controllers.create)
router.put('/', controllers.update)


module.exports = router;