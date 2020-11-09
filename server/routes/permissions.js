const router = require('express').Router();

var controllers = require('../controllers/permissions');

router.post('/check', controllers.check)


module.exports = router;