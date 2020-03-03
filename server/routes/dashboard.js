const router = require('express').Router();

var controllers = require('../controllers/dashboard');

router.get('/sale', controllers.rptSaleByMonth)

module.exports = router;