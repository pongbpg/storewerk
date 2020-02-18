const router = require('express').Router();

var controllers = require('../controllers/members');

router.get('/', controllers.getById)
router.get('/tel', controllers.getByTel)
router.get('/account', controllers.getByAccountId)
router.post('/', controllers.create)
router.put('/', controllers.update)


module.exports = router;