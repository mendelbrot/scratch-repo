const express = require('express')
const bodyParser = require('body-parser')
const uuidv4 = require('uuid/v4')
const {join} = require('path')

const {PrizeInterface} = require('./prize-interface')

const sessionId = uuidv4()
// Initiate Prizes
const prizeInterface = new PrizeInterface({successRate: 75})
prizeInterface.addPrize('sweater', 13)
prizeInterface.addPrize('shirt', 35)
prizeInterface.addPrize('bands', 45)
prizeInterface.addPrize('notebook', 70)

const server = express()
server.use(bodyParser.json())
server.use(express.static(join(__dirname, '../build')))

server.get('/status', function(req, res) {
  return res.status(200).json(prizeInterface.status)
})

server.post('/prizes', function(req, res) {
  if (req.body.sessionId === sessionId) {
    return res.status(200).json({sessionId})
  } else {
    const prize = prizeInterface.assignRandomPrize()
    return res.status(200).json({sessionId, prize})
  }
})

server.post('/prizes/:id/redeem', function(req, res) {
  const {id} = req.params
  const resBody = prizeInterface.redeemPrize(id)
  if (resBody.error) {
    return res.status(400).json(resBody)
  } else {
    return res.status(200).json(resBody)
  }
})

server.post('/prizes/reset', function(req, res) {
  const assignedPrizeCount = prizeInterface.totalQuantity('assigned')
  prizeInterface.resetAssignedPrizes()
  return res.status(200).json({...prizeInterface.status, resetCount: assignedPrizeCount})
})

server.get('/*', function(req, res) {
  return res.status(200).sendFile(join(__dirname, '../build/index.html'))
})

const port = process.env.PORT || 8080
server.listen(port)

console.log(`App is listening on port ${port}. Visit http://localhost:${port}`)
