const catchAsync = require('../helpers/catchAsync');
const Experience = require('../schemas/experience');
const { all, create, findByPk, update, seed, destroy, paginate } = require('./factoryController');

exports.seed = seed(Experience, 'experience');
exports.all = all(Experience);
exports.paginate = paginate(Experience);
exports.create = create(Experience);
exports.findByPk = findByPk(Experience);
exports.update = update(Experience);
exports.destroy = destroy(Experience);
