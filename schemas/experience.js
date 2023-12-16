const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const { EXPERIENCE_TYPES } = require('../constants')
const Experience = dbConnect.define(
  'Experience',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a title.',
        },
        notEmpty: {
          msg: 'Provide a title.',
        },
      },
    },
    experienceType: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a experience type.',
        },
        notEmpty: {
          msg: 'Provide a experience type.',
        },
        isIn: {
          args: [EXPERIENCE_TYPES],
          msg: 'Provide a valid experience type.',
        },
      },
    },
    companyName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a company name.',
        },
        notEmpty: {
          msg: 'Provide a company name.',
        },
      },
    },

    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a description.',
        },
        notEmpty: {
          msg: 'Provide a description.',
        },
      },
    },

    location: DataTypes.STRING(100),
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
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a end date.',
        },
        notEmpty: {
          msg: 'Provide a end date.',
        },
      },
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
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a end year.',
        },
        notEmpty: {
          msg: 'Provide a end year.',
        },
      },
    },
    skills: DataTypes.JSON,
    current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'experiences',
  }
)

module.exports = Experience
