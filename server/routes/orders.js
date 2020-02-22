const router = require('express').Router();

var controllers = require('../controllers/orders');

router.get('/', controllers.getById)
router.get('/detail', controllers.getDetailById)
router.get('/latest/no', controllers.getOrderNoLatest)
router.get('/account', controllers.getByAccountId)
router.post('/', controllers.created)
router.put('/', controllers.updated)
router.delete('/:orderId', controllers.deleted)


module.exports = router;