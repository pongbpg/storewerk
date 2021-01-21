const router = require('express').Router();

var controllers = require('../controllers/prints');

router.post('/request', controllers.request)
router.post('/product/used', controllers.productUsed)
router.post('/product/init', controllers.productInit)


module.exports = router;