const router = require('express').Router()
router.use('/api/v1/auth', require('./authRoutes'))
router.use('/api/v1/skills', require('./skillRoutes'))
router.use('/api/v1/users', require('./userRoutes'))
router.use('/api/v1/projects', require('./projectRoutes'))
router.use('/api/v1/experiences', require('./experienceRoutes'))
router.use('/api/v1/educations', require('./educationRoutes'))

module.exports = router
