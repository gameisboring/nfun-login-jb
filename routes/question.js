const express = require('express')
const models = require('../models')
const router = express.Router()

/**
 * POST questions Info.
 */
router.post('/', (req, res) => {
  const { name, account, context } = req.body

  models.Question.create({
    name: name,
    account: account,
    context: context,
  })

  res.send({ ok: true })
})

/**
 * GET question Info
 */
router.get('/', async (req, res) => {
  const result = await models.Question.findAll({
    attributes: ['name', 'account', 'createdAt', 'context'],
  })
  res.send(result)
})

module.exports = router
