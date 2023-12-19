const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')

const Education = dbConnect.define(
  'Education',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      set(value) {
        this.setDataValue('name', value.trim())
      },
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The name  is required',
        },
        notEmpty: {
          msg: 'The name  is required',
        },
        len: {
          args: [3, 50],
          msg: 'The name must have between 3 to 50 characters.',
        },
      },
    },
    degree: DataTypes.STRING(50),
    startMonth: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a start date.',
        },
        notEmpty: {
          msg: 'Provide a start date.',
        },
      },
    },
    endMonth: {
      type: DataTypes.STRING(10),
      allowNull: true,
      // validate: {
      //   notNull: {
      //     msg: 'Provide a end date.',
      //   },
      //   notEmpty: {
      //     msg: 'Provide a end date.',
      //   },
      // },
    },
    startYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a start year.',
        },
        notEmpty: {
          msg: 'Provide a start year.',
        },
      },
    },
    endYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // validate: {
      //   notNull: {
      //     msg: 'Provide a end year.',
      //   },
      //   notEmpty: {
      //     msg: 'Provide a end year.',
      //   },
      // },
    },
    current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    skills: DataTypes.JSON,
    location: DataTypes.STRING(100),
    organization: DataTypes.JSON,
    credentialUrl: DataTypes.STRING,

    type: {
      type: DataTypes.STRING,
      defaultValue: 'education',
      validate: {
        isIn: {
          args: [['education', 'certification', 'license']],
          msg: 'The type must be education',
        },
      },
    },
  },
  {
    tableName: 'educations',
  }
)

module.exports = Education
