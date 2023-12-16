const { DataTypes } = require('sequelize');
const { dbConnect } = require('../db/index');

const Skill = dbConnect.define(
  'Skill',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      // seeter to remove spaces
      unique: {
        msg: 'The name of the skill is already in use',
      },
      set(value) {
        this.setDataValue('name', value.trim());
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The name of the skill is required',
        },
        notEmpty: {
          msg: 'The name of the skill is required',
        },
        len: {
          args: [3, 50],
          msg: 'The name must have between 3 to 50 characters.',
        },
      },
    },
  },
  {
    tableName: 'skills',
  }
);

module.exports = Skill;
