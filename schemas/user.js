const { DataTypes } = require('sequelize');
const { dbConnect } = require('./../db/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = dbConnect.define(
  'User',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The username cannot be null.',
        },
        notEmpty: {
          msg: 'The username cannot be null.',
        },
        len: {
          args: [3, 50],
          msg: 'The name must have between 3 to 50 characters.',
        },
      },
    },
    googleId: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : {
        msg: 'The mail already exists.',
      },
      validate: {
        notNull: {
          msg: 'The mail cannot be null.',
        },
        notEmpty: {
          msg: 'The mail cannot be null.',
        },
        isEmail: {
          msg: 'You must enter a valid email.',
        }
       
      },
    },
    photo: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      enum: ['user', 'helper', 'admin','client'],
      defaultValue: 'user',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The password cannot be null.',
        },
        notEmpty: {
          msg: 'The password cannot be null.',
        }
      }
    },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    active: {
      type: DataTypes.BOOLEAN ,
      defaultValue: true,
    },
  },
  {
    tableName: 'users',
  }
);

User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 12);
});

User.prototype.checkPassword = async function (userPassword, hash) {
  return await bcrypt.compare(userPassword, hash);
};
User.prototype.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

User.prototype.changePasswordAfter = function (jwtIat) {
  if (this.passwordChangedAt) {
    const changePassword = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtIat < changePassword;
  }
  return false;
};

User.prototype.createPasswordResetToken = function () {
  //create token
  const resetToken = crypto.randomBytes(32).toString('hex');
  //encrypt the token and save to the database
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  //store the time plus 10 mns to the satabase
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //return the token without encrypt
  return resetToken;
};

module.exports = User;
