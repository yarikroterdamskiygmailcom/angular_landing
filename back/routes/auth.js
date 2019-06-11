const express = require('express')
const controller = require('../controllers/auth')

const router = express.Router()


// localhost:4000/matches/auth/login
router.post('/login', controller.login)

// localhost:4000/matches/auth/register
router.post('/register', controller.register)

router.post('/confirmation', controller.confirmationPost);
router.post('/resend', controller.resendTokenPost);
router.post('/update', controller.checkEmail)
router.post('/changepass', controller.changePass)



module.exports = router