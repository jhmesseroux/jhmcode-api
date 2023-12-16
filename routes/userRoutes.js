const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const usersRouter = express.Router();
usersRouter.post('/seed', userController.seed);

usersRouter.use(authController.protect);

usersRouter.get('/Me', userController.GetMe, userController.findByPk);
usersRouter.patch('/updateMyPassword', authController.updatePassword);
usersRouter.patch('/updateMe', authController.restrictTo('user', 'admin'), userController.updateMe);
usersRouter.delete('/deleteMe', authController.restrictTo('user'), userController.deleteMe);

usersRouter.use(authController.restrictTo('admin'));
usersRouter.route('/').get(userController.all);
usersRouter.route('/paginate').get(userController.paginate);
usersRouter.route('/:id').get(userController.findByPk).patch(userController.update).delete(userController.destroy);

module.exports = usersRouter;
