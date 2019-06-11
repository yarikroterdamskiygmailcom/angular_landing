const express = require('express')
const passport = require('passport')
const controller = require('../controllers/stripe-order')

const router = express.Router()


router.post('/payment', passport.authenticate('jwt', { session: false }), controller.order)


module.exports = router