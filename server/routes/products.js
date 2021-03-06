const router = require('express').Router();

var controllers = require('../controllers/products');

router.get('/', controllers.getById)
router.get('/account', controllers.getByAccountId)
router.post('/', controllers.create)
router.put('/', controllers.update)


module.exports = router;