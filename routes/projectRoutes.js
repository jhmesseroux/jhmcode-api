const express = require('express');
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.post('/seed', projectController.seed);

router.get('/', projectController.all);
router.get('/paginate', projectController.paginate);

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').post(projectController.create);
router.route('/:id').get(projectController.findByPk).put(projectController.update).delete(projectController.destroy);

module.exports = router;
