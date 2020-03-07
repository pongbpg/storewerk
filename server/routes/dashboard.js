const router = require('express').Router();

var controllers = require('../controllers/dashboard');

router.get('/sale', controllers.rptSaleByMonth)
router.get('/product', controllers.rptProductByMonth)

module.exports = router;