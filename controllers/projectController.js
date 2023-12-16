const catchAsync = require('../helpers/catchAsync')
const Project = require('../schemas/project')
const { all, create, findByPk, update, seed, destroy,paginate } = require('./factoryController')


exports.seed = seed(Project, 'project')
exports.all = all(Project)
exports.paginate = paginate(Project)
exports.create = create(Project)
exports.findByPk = findByPk(Project)
exports.update = update(Project, ['dsc_rubro', 'cod_rubro', 'CategoriaAdmId'])
exports.destroy = destroy(Project)