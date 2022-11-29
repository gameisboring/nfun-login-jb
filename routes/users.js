const express = require('express')
const models = require('../models')
const { logger, logError, logReqInfo } = require('../lib/winston')
const router = express.Router()

const xlsx = require('xlsx')
const fs = require('fs')
const path = require('path')

const Sequelize = require('sequelize')

/* POST user upsert */
router.post('/', async (req, res) => {
  const { name, account } = req.body

  if (!name && !account) {
    logError(req, account, name)
    res.send({
      ok: false,
      status: 'empty',
    })
  } else {
    logReqInfo(req, account, name)

    models.User.findOne({
      where: { name: name, account: account },
      attributes: ['account', 'name', 'role', 'lastAccess'],
    }).then((user) => {
      if (user) {
        user
          .update({ lastAccess: new Date() })
          .then((r) => console.log('Data is updated!'))
        res.send({
          ok: true,
          user: user,
          visit_first: false,
          role: user.dataValues.role,
        })
      } else {
        const user = models.User.create({
          account: account,
          name: name,
          lastAccess: new Date(),
          role: '시청자',
        }).then((r) => console.log('Data is Created!'))
        console.log(user)
        res.send({
          ok: true,
          user: user,
          visit_first: true,
          role: '시청자',
        })
      }
    })
  }
})

/**
 * GET users Info
 */
router.get('/', async (req, res) => {
  logReqInfo(req)
  const result = await models.User.findAll({
    attributes: ['name', 'account', 'createdAt', 'lastAccess', 'role'],
  })
  res.send(result)
})

/**
 * POST users ping
 */
router.post('/ping', async (req, res) => {
  const { name, account } = req.body
  logReqInfo(req, req.body.account, req.body.name)
  await models.User.update(
    {
      lastAccess: new Date(),
    },
    {
      where: {
        name: req.body.name,
        account: req.body.account,
      },
    }
  ).catch((err) => {
    console.log(err)
  })

  res.send({ ok: true })
})

/**
 * GET users info download
 */
router.get('/download', async (req, res) => {
  const { name, account } = req.body
  logReqInfo(req, account, name)
  try {
    const result = await models.User.findAll({
      attributes: ['name', 'account', 'createdAt', 'lastAccess'],
      raw: true,
    })
    result.forEach((data) => {
      data.createdAt = new Date(data.createdAt).toLocaleString()
    })
    console.log(result)
    const fileServe = new Promise(async (res, rej) => {
      if (result) {
        const userListXLSXfromJSON = xlsx.utils.json_to_sheet(result)
        const stream = xlsx.stream.to_csv(userListXLSXfromJSON)
        const fileName = path.join(
          __dirname,
          '..',
          'public',
          'download',
          '2022년도_국가손상조사감시사업_결과보고회_참석자리스트.csv'
        )
        await stream.pipe(fs.createWriteStream(fileName))
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
