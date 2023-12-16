const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('../helpers/catchAsync');
const User = require('./../schemas/user');
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/AppError');
const { Op } = require('sequelize');

const createToken = (user) => {
  return jwt.sign(user, process.env.SECRET_TOKEN_JHMCODE_APP_2023, {
    expiresIn: process.env.SECRET_TOKEN_JHMCODE_APP_2023_INSPIRE_IN,
  });
};

const createSendToken = async (user, statusCode, res) => {
  const token = createToken({
    email: user.email,
    username: user.username,
    photo: user.photo,
    role: user.role,
    id: user.id,
  });

  user.password = undefined;

  return res.status(statusCode).json({
    code: 200,
    status: 'success',
    ok: true,
    token,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body, { fields: ['username', 'password', 'email', 'role'] });
  createSendToken(newUser, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Proporcione un correo electrónico y una contraseña por favor.', 400));

  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Correo o contraseña incorrectos.', 401));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new AppError('No has iniciado sesión, ¡identifícate para obtener acceso!', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_TOKEN_JHMCODE_APP_2023);
  const currentUser = await User.findByPk(decoded.id);

  if (!currentUser) return next(new AppError('El usuario ya no existe', 401));

  if (currentUser.changePasswordAfter(decoded.iat))
    return next(new AppError('Este usuario cambió recientemente su contraseña. Inicie sesión de nuevo', 401));

  req.user = currentUser;
  next();
});

exports.renewToken = catchAsync(async (req, res, next) => createSendToken(req.user, 200, res));

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('No tienes permiso para realizar esta acción', 403));
    next();
  };
exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) return next(new AppError('El correo es requerido.', 404));

  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return next(new AppError('No existe un usuario con este correo electrónico.', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save();

  try {
    // http://vps-1387733-x.dattaweb.com:4000/api/v1
    // https://marani-ferreteria.netlify.app/
    const resetURL = `${req.protocol}://marani-ferreteria.netlify.app/resetPassword/${resetToken}`;
    res.status(200).json({
      status: 'success',
      message: 'Token sent successfully!',
    });
  } catch (err) {
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    return next(new AppError('Hubo un problema al enviar el correo electrónico.', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get Uer based on the token
  if (!req.params.token) return next(new AppError('Token inválido o caducado.', 404));
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    where: { passwordResetToken: hashToken, passwordResetExpires: { [Op.gt]: Date.now() } },
  });

  if (!user) return next(new AppError('No existe un usuario para este token. Token no válido o caducado.', 404));

  //validate user and token
  user.password = await user.hashPassword(req.body.password);
  // user.password = await (req.body.password);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  //Log in user again
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get the user
  const user = await User.findOne({ where: { email: req.user.email } });

  //check password
  if (!user || !(await user.checkPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Contraseña incorrecta', 401));
  }

  //update password
  user.password = await user.hashPassword(req.body.password);
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePasswordOtherUser = catchAsync(async (req, res, next) => {
  // Get the user
  const user = await User.findOne({ where: { email: req.body.email } });

  // check password
  if (!user) {
    return next(new AppError('No existe ese usuario.', 401));
  }

  //update password
  user.password = await user.hashPassword(req.body.password);
  await user.save();
  return res.status(200).json({
    status: 'success',
    ok: true,
    code: 200,
    message: 'Contraseña actualizada correctamente.',
  });
});
