const express = require('express')
const authController = require('../controllers/authController')
const eduController = require('../controllers/eduController')

const router = express.Router()

router.post('/seed', eduController.seed)

router.get('/', eduController.all)
router.get('/paginate', eduController.paginate)

router.use(authController.protect, authController.restrictTo('admin'))
router.route('/').post(eduController.create)
router.route('/:id').get(eduController.findByPk).put(eduController.update).delete(eduController.destroy)

module.exports = router
