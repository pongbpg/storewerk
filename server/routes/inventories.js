const router = require('express').Router();

var controllers = require('../controllers/inventories');

router.get('/warehouse', controllers.getByWarehouseId)
router.get('/account', controllers.getByAccountId)

module.exports = router;