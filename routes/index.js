/* eslint-disable no-console */
const express = require('express')
const models = require('../models')
const { logger, logError, logReqInfo } = require('../lib/winston')
const router = express.Router()

/* GET login page. */
router.get('/', (req, res) => {
  logReqInfo(req)
  res.render('index', { title: '2022년도 국가손상조사감시사업 결과보고회' })
})

/* GET home page. */
router.get('/home', (req, res) => {
  logReqInfo(req)

  res.render('home', {
    title: '2022년도 국가손상조사감시사업 결과보고회',
    account: req.query.acc,
    name: req.query.name,
  })
})

/* GET admin page */
router.get('/admin', (req, res) => {
  res.render('admin', {
    title: '2022년도 국가손상조사감시사업 결과보고회',
    account: req.query.acc,
  })
})

module.exports = router
