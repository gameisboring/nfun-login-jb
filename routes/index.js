/* eslint-disable no-console */
const express = require('express')

const router = express.Router()

/* GET login page. */
router.get('/', (req, res) => {
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

module.exports = router
