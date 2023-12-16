const catchAsync = require('../helpers/catchAsync')
const { Op } = require('sequelize')
const AppError = require('../helpers/AppError')
const filterQueryParams = require('../helpers/filterqueryParams')
const { generateFakeData } = require('../helpers/faker')

const filterFields = (obj, allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.create = (Model, allowedFileds = null) =>
  catchAsync(async (req, res) => {
    const insertedFileds = allowedFileds
      ? filterFields(req.body, allowedFileds)
      : req.body
    const doc = await Model.create(insertedFileds)
    return res.json({
      ok: true,
      code: 201,
      status: 'success',
      message: 'The record was created successfully.',
      data: doc,
    })
  })

exports.bulk = (Model, data = null) =>
  catchAsync(async (req, res) => {
    const doc = await Model.bulkCreate(data ? data : req.body)
    return res.json({
      ok: true,
      code: 200,
      status: 'success',
      message: 'The records were created successfully.',
      data: doc,
    })
  })

exports.all = (Model, opts = null) =>
  catchAsync(async (req, res) => {
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined
    const queryFiltered = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'include']
    excludeFields.forEach((el) => delete queryFiltered[el])

    const docs = await Model.findAll({
      where: filterQueryParams(queryFiltered),
      include,
      attributes: req.query.fields
        ? req.query.fields
            .toString()
            .split(',')
            .map((el) => (el.includes(':') ? el.split(':') : el))
        : '',
      order: req.query.sort
        ? req.query.sort
            .toString()
            .split(',')
            .map((el) => el.split(':'))
        : [['id', 'desc']],
    })
    return res.json({
      ok: true,
      code: 200,
      status: 'success',
      results: docs.length,
      data: docs,
    })
  })

exports.paginate = (Model, opts = null) =>
  catchAsync(async (req, res, next) => {
    if (!req.query.limit || !req.query.page)
      return next(
        new Error(
          'El parametro limit y/o page es obligatorio para usar este metodo!'
        )
      )
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined
    const queryFiltered = { ...req.query }

    const excludeFields = ['page', 'sort', 'limit', 'fields', 'include']
    excludeFields.forEach((el) => delete queryFiltered[el])

    const page = parseInt(req.query.page) * 1 || 1
    const limit = parseInt(req.query.limit) * 1 || 50
    const offset = (page - 1) * limit

    const { rows, count } = await Model.findAndCountAll({
      where: filterQueryParams(queryFiltered),
      include,
      limit,
      offset,
      attributes: req.query.fields
        ? req.query.fields
            .toString()
            .split(',')
            .map((el) => (el.includes(':') ? el.split(':') : el))
        : '',
      order: req.query.sort
        ? req.query.sort
            .toString()
            .split(',')
            .map((el) => el.split(':'))
        : [['id', 'desc']],
    })

    return res.json({
      ok: true,
      code: 200,
      status: 'success',
      results: rows.length,
      total: count,
      page,
      offset,
      data: rows,
    })
  })

exports.findByPk = (model, opts = null) =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id || isNaN(+req.params.id))
      return next(
        new AppError(
          'The id is required to update a record and has to be a valid value.',
          400
        )
      )
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined

    const doc = await model.findByPk(req.params.id, { include })
    if (!doc)
      return next(new AppError('There is no document with that ID.', 404))
    return res.status(200).json({
      ok: true,
      code: 200,
      status: 'success',
      data: doc,
    })
  })

exports.findOne = (model, opts = null) =>
  catchAsync(async (req, res, next) => {
    let include = null
    if (opts && req.query.include === undefined) include = opts.include
    else include = undefined

    const queryFiltered = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'include']
    excludeFields.forEach((el) => delete queryFiltered[el])

    const doc = await model.findOne({
      where: filterQueryParams(queryFiltered),
      include,
      attributes: req.query.fields
        ? req.query.fields
            .toString()
            .split(',')
            .map((el) => (el.includes(':') ? el.split(':') : el))
        : '',
    })

    return res.status(200).json({
      ok: true,
      code: 200,
      status: 'success',
      data: doc,
    })
  })

exports.update = (Model, allowedFileds = null) =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id || isNaN(+req.params.id))
      return next(
        new AppError(
          'The id is required to update a record and has to be a valid value.',
          400
        )
      )

    const insertedFileds = allowedFileds
      ? filterFields(req.body, allowedFileds)
      : req.body
    const doc = await Model.update(insertedFileds, {
      where: { id: req.params.id },
    })

    if (doc[0] <= 0)
      return next(
        new AppError(
          `The record with id :  ${req.params.id} does not exist or no record was updated in the table.`,
          304
        )
      )

    return res.json({
      ok: true,
      status: 'success',
      code: 200,
      message: 'The record was updated successfully.',
    })
  })

exports.down = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id || isNaN(+req.params.id))
      return next(
        new AppError(
          'The id is required to update a record and has to be a valid value.',
          400
        )
      )
    const doc = await Model.update(
      { active: 0 },
      { where: { id: req.params.id } }
    )
    if (doc[0] <= 0)
      return next(
        new AppError(`There is no record with the id :  ${req.params.id} `, 304)
      )
    return res.json({
      ok: true,
      status: 'success',
      code: 200,
      message: 'The record was updated successfully.',
      data: null,
    })
  })

exports.up = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id || isNaN(+req.params.id))
      return next(
        new AppError(
          'The id is required to update a record and has to be a valid value.',
          400
        )
      )
    const doc = await Model.update(
      { state: 1 },
      { where: { id: req.params.id } }
    )
    if (doc[0] <= 0)
      return next(
        new AppError(`There is no record with the id :  ${req.params.id} `, 304)
      )
    return res.json({
      ok: true,
      status: 'success',
      code: 200,
      message: 'The record was updated successfully.',
    })
  })

exports.destroy = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id || isNaN(+req.params.id))
      return next(
        new AppError(
          'The id is required to delete a record and has to be a valid value.',
          400
        )
      )
    const doc = await Model.destroy({ where: { id: req.params.id } })
    if (doc <= 0)
      return next(
        new AppError(`No hay registro para el id :  ${req.params.id} `, 404)
      )
    return res.status(200).json({
      ok: true,
      status: 'success',
      code: 200,
      message: 'The record was deleted successfully.',
      data: null,
    })
  })

exports.seed = (Model, type) =>
  catchAsync(async (req, res) => {
    let data = []
    if (req.body.data) data = req.body.data
    else {
      let q = req.query.quantity || 10
      for (let i = 0; i < q; i++) {
        data.push(generateFakeData(type))
      }
    }
    const doc = await Model.bulkCreate(data)
    return res.json({
      ok: true,
      code: 200,
      status: 'success',
      message: 'The records were created successfully.',
      data: doc,
    })
  })
