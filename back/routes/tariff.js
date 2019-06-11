const express = require('express')
const controller = require('../controllers/tariff')

const router = express.Router()



router.post('/create', controller.create)


router.get('/getall', controller.getAll)
router.get('/get/:id', controller.getById)


module.exports = router