const express = require('express')
const models = require('../models')
const { logger, logError, logReqInfo } = require('../lib/winston')
const router = express.Router()

const xlsx = require('xlsx')
const fs = require('fs')
const path = require('path')

/**
 * POST Questions Info.
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
 * GET Question Page
 */

router.get('/', (req, res) => {
  logReqInfo(req)
  res.render('question', { title: '2022년도 국가손상조사감시사업 결과보고회' })
})

/**
 * GET Question Data
 */
router.get('/data', async (req, res) => {
  logReqInfo(req)
  const result = await models.Question.findAll({
    attributes: ['name', 'account', 'createdAt', 'context'],
    raw: true,
  })
    .then((result) => {
      result.forEach((data) => {
        data.createdAt = new Date(data.createdAt).toLocaleString('ko-KR')
      })
      return result
    })
    .then((result) => {
      res.send(result)
    })
})

/**
 * GET Question download
 */
router.get('/download', async (req, res) => {
  const { name, account } = req.body
  logReqInfo(req, account, name)

  try {
    const result = await models.Question.findAll({
      attributes: ['name', 'account', 'createdAt', 'context'],
      raw: true,
    })

    result.forEach((data) => {
      data.createdAt = new Date(data.createdAt).toLocaleString()
    })
    console.log(result)
    const fileServe = new Promise((res, rej) => {
      if (result) {
        const userListXLSXfromJSON = xlsx.utils.json_to_sheet(result)
        const stream = xlsx.stream.to_csv(userListXLSXfromJSON)
        const fileName = path.join(
          __dirname,
          '..',
          'public',
          'download',
          '2022년도_국가손상조사감시사업_결과보고회_질문리스트.csv'
        )
        stream.pipe(fs.createWriteStream(fileName))
        res(fileName)
      }
    })

    fileServe.then((fileName) => {
      res.download(fileName)
    })
  } catch (error) {
    logger.error('유저 목록 조회 실패')
    console.log(error)
  }
})

module.exports = router
