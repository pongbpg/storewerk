const router = require('express').Router();

var controllers = require('../controllers/prints');

router.post('/request', controllers.request)


module.exports = router;