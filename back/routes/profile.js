const express = require('express')
const passport = require('passport')
const controller = require('../controllers/profile')
const upload = require('../middleware/upload')

const router = express.Router()



router.patch('/update/:id', upload.single('image'), passport.authenticate('jwt', { session: false }), controller.update)


router.get('/get/:user', passport.authenticate('jwt', { session: false }), controller.get)
// router.post('/create', passport.authenticate('jwt', { session: false }), controller.create)

module.exports = router
