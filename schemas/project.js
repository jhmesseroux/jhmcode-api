const { DataTypes } = require('sequelize')
const { dbConnect } = require('../db/index')
const Skill = require('./skill')
const Project = dbConnect.define(
  'Project',
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },

    level: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a level.',
        },
        notEmpty: {
          msg: 'Provide a level.',
        },
        isIn: {
          args: [['Beginner', 'Intermediate', 'Advanced']],
          msg: 'Provide a valid level.',
        },
      },
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
    description: {
      type: DataTypes.STRING(500),
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
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Provide a photo.',
        },
        notEmpty: {
          msg: 'Provide a photo.',
        },
      },
    },
    skills: DataTypes.JSON,
    demoLink: DataTypes.STRING,
    collaborators: DataTypes.JSON,
    gitBack: DataTypes.STRING,
    gitFront: DataTypes.STRING,
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
  },
  {
    tableName: 'projects',
  }
)

module.exports = Project
