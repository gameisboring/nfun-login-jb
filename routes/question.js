const express = require('express')

const router = express.Router()

/**
 * POST questions Info.
 */
router.post('/', (req, res) => {
  console.log(req.body)
  res.send({ ok: true })
})

/**
 * GET question Info
 */
router.get('/', (req, res) => {
  res.send('resond with a resource')
})

module.exports = router
