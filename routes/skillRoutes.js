const express = require('express');
const authController = require('../controllers/authController');
const skillController = require('../controllers/skillController');

const router = express.Router();

router.post('/seed', skillController.seed);

router.get('/', skillController.all);
router.get('/paginate', skillController.paginate);

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').post(skillController.create);
router.route('/:id').get(skillController.findByPk).put(skillController.update).delete(skillController.destroy);

module.exports = router;
