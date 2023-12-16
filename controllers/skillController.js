const catchAsync = require('../helpers/catchAsync');
const Skill = require('../schemas/skill');
const { all, create, findByPk, update, seed, destroy, paginate } = require('./factoryController');

exports.seed = seed(Skill, 'skill');
exports.all = all(Skill);
exports.paginate = paginate(Skill);
exports.create = create(Skill);
exports.findByPk = findByPk(Skill);
exports.update = update(Skill);
exports.destroy = destroy(Skill);
