const { Op } = require('sequelize')

// value:oprator => 10:gt => { [Op.gt]: 10 }, 12,3,4:in , 1,0 : or

const filterQueryParams = (queryFiltered) => {
  const options = { ...queryFiltered }
  Object.keys(queryFiltered).forEach((k) => {
    if (k === 'multiples') {
      const multipleValues = queryFiltered[k].split(':')
      options[Op.or] = multipleValues[1].split(',').map((field) => {
        // Puedes aplicar lógica adicional aquí según tus necesidades
        const condition = {}
        condition[field] = {
          [Op.like]: `%${multipleValues[0]}%`,
        }
        return condition
      })
      // delete multples from options
      delete options.multiples
      return
    }
    if (queryFiltered[k].toString().split(':').length > 1) {
      const val = queryFiltered[k].toString().split(':')
      switch (val[1]) {
        case 'like':
          options[`${k}`] = {
            [Op.substring]: val[0],
          }
          break
        case 'eq':
          options[`${k}`] = {
            [Op.eq]: val[0],
          }
          break
        case 'ne':
          options[`${k}`] = {
            [Op.ne]: val[0] === 'null' ? null : val[0],
          }
          break
        case 'gt':
          options[`${k}`] = {
            [Op.gt]: val[0],
          }
          break
        case 'gte':
          options[`${k}`] = {
            [Op.gte]: val[0],
          }
          break
        case 'lt':
          options[`${k}`] = {
            [Op.lt]: val[0],
          }
          break
        case 'lte':
          options[`${k}`] = {
            [Op.lte]: val[0],
          }
          break
        case 'between':
          options[`${k}`] = {
            [Op.between]: val[0].split(',').map((i) => i),
          }
          break
        case 'or':
          options[`${k}`] = {
            [Op.or]: val[0]
              .split(',')
              .map((i) => (typeof i === 'number' ? i : i)),
          }
          break
        case 'and':
          options[`${k}`] = {
            [Op.and]: val[0]
              .split(',')
              .map((i) => (typeof i === 'number' ? i : i)),
          }
          break
        case 'notBetween':
          options[`${k}`] = {
            [Op.notBetween]: val[0].split(',').map((i) => i),
          }
          break
        case 'in':
          options[`${k}`] = {
            [Op.in]: val[0]
              .split(',')
              .map((i) => (typeof i === 'number' ? i : i)),
          }
          break
        case 'notIn':
          options[`${k}`] = {
            [Op.notIn]: val[0]
              .split(',')
              .map((i) => (typeof i === 'number' ? i : i)),
          }
          break
        default:
          break
      }
    } else {
      options[`${k}`] = {
        [Op.eq]: queryFiltered[k] === 'null' ? null : queryFiltered[k],
      }
    }
  })

  return options
}

module.exports = filterQueryParams
