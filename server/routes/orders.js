const router = require('express').Router();

var controllers = require('../controllers/orders');

router.get('/', controllers.getById)
router.get('/latest/no', controllers.getOrderNoLatest)
router.get('/account', controllers.getByAccountId)
router.post('/', controllers.create)
router.put('/', controllers.update)


module.exports = router;