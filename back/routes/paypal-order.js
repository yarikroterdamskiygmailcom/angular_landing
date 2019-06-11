const express = require('express')
const passport = require('passport')
const controller = require('../controllers/paypal-order')

const router = express.Router()


router.post('/payment', passport.authenticate('jwt', { session: false }), controller.order)
router.get('/result/:user/:price/:tariff/:paymentId/:payerID', passport.authenticate('jwt', { session: false }), controller.result)

module.exports = router