/* eslint-disable no-console */
const express = require('express')
const { NOW } = require('sequelize')
const models = require('../models')

const router = express.Router()

/* GET login page. */
router.get('/', (req, res) => {
  console.log(Date(Date.now().valueOf()))
  console.log(Date.now())
  res.render('index', { title: '2022년도 국가손상조사감시사업 결과보고회' })
})

/* GET home page. */
router.get('/home', (req, res) => {
  const account = req.query.acc

  res.render('home', {
    title: '2022년도 국가손상조사감시사업 결과보고회',
    account: account,
  })
})

/* POST login page */
router.post('/', async (req, res) => {
  const name = req.body.name
  const account = req.body.account

  if (!name && !account) {
    res.send({
      ok: false,
      status: 'empty',
    })
  } else {
    const [user, created] = await models.User.upsert(
      { account: account, name: name, lastAccess: new Date() },
      {
        where: { name: name, account: account },
      }
    )
    if (user) {
      console.log(user)
      console.log(created)
      res.send({
        ok: true,
      })
    }
  }
})

/* GET admin page */
router.get('/admin', (req, res) => {
  res.render('admin')
})

module.exports = router
