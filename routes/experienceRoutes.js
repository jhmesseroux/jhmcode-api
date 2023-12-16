const express = require('express');
const authController = require('../controllers/authController');
const expController = require('../controllers/expController');

const router = express.Router();

router.post('/seed', expController.seed);

router.get('/', expController.all);
router.get('/paginate', expController.paginate);

router.use(authController.protect, authController.restrictTo('admin'));
router.route('/').post(expController.create);
router.route('/:id').get(expController.findByPk).put(expController.update).delete(expController.destroy);

module.exports = router;
