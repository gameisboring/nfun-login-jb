const express = require('express')
const models = require('../models')

const router = express.Router()

/**
 * POST users Info.
 */
router.post('/', (req, res) => {
  res.send('respond with a resource')
})

/**
 * GET users Info
 */
router.get('/', (req, res) => {
  res.send('resond with a resource')
})

module.exports = router
