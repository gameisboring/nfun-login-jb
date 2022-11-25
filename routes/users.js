const express = require('express')
const models = require('../models')
const { logger, logError, logReqInfo } = require('../lib/winston')
const router = express.Router()

/* POST user upsert */
router.post('/', async (req, res) => {
  const { name, account } = req.body

  if (!name && !account) {
    res.send({
      ok: false,
      status: 'empty',
    })
    logError(req, account, name)
  } else {
    logReqInfo(req, account, name)
    const [user, created] = await models.User.upsert(
      { account: account, name: name, lastAccess: new Date(), role: '시청자' },
      { lastAccess: new Date() },
      {
        where: { name: name, account: account },
      }
    )
    if (user) {
      res.send({
        ok: true,
        user: user,
        visit_first: created,
      })
    }
  }
})

/**
 * GET users Info
 */
router.get('/', async (req, res) => {
  const result = await models.User.findAll({
    attributes: ['name', 'account', 'updatedAt', 'lastAccess'],
  })
  res.send(result)
})

module.exports = router
