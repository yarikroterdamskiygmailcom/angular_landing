const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Profile = require('../models/Profile')
const Tariff = require('../models/Tariff')
const kyes = require('../config/keys')
const errorHandler = require('../utils/ErrorHandler')
const Token = require('../models/MeilTocken')
const Pass = require('../models/Passtocken')
const moment = require('moment')
const momentTimeZone = require('moment-timezone')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports.login = async function (req, res) {

  const candidate = await User.findOne({ email: req.body.email })
  if (!candidate) {
    res.status(401).json({ message: 'We can not find this user.' });
  } else {
    if (!candidate.isVerified) {
      res.status(401).json({ message: 'Your account has not been verified Verify it!! Please.' });
    }
    try {
      const passwordResult = bcript.compareSync(req.body.password, candidate.password)
      if (passwordResult) {
        const token = jwt.sign({
          email: candidate.email,
          userId: candidate._id
        }, kyes.jwt, { expiresIn: 60 * 60 * 24 })

        res.status(200).json({
          token: `Bearer ${token}`,
          id: candidate._id
        })
      }
    } catch (e) {
      res.status(401).json({ message: 'Bad login or password.' });
    }
  }

}



module.exports.register = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email })
  if (candidate) {
    res.status(409).json({
      message: ' Something goes wrong or This email is already existed!'
    })
  } else {
    const salt = bcript.genSaltSync(10)
    const password = req.body.password
    const user = new User({
      email: req.body.email,
      password: bcript.hashSync(password, salt)
    })
    try {
      await user.save()
      const newUser = await User.findOne({ email: req.body.email })
      const plan = await Tariff.findOne({ name: "Free" })
      const profile = await new Profile({
        gender: '',
        userName: '',
        birthDate: '',
        user: newUser._id,
        tariffPlan: plan._id,
        timeZone: 'CET',
        imageSrc: ''
      }).save()
      const token = await new Token({
        _userId: user._id, token: crypto.randomBytes(16).toString('hex')
      }).save();
      console.log(process.env.USER_NAME)
      console.log(process.env.PASSWORD)
      console.log(user.email)


      const transporter = await nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.USER_NAME,
          pass: process.env.PASSWORD
        }
      });


      const link = `http://localhost:4200/verify/${user.email}?id=` + token.token;
      console.log("TOKEN", token.token)
      console.log(link)
      const mailOptions = {
        to: user.email,
        subject: 'Please confirm your Email account',
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
      };

      let info = await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);

        } else {
          console.log("Super", info);
        }

      });


      res.status(201).json(user)
    } catch (e) {
      errorHandler(res, e)
    }
  }
}

module.exports.confirmationPost = async function (req, res) {
  console.log(req.body.email)
  console.log(req.body.token)
  // Find a matching token
  try {
    const token = await Token.findOne({ token: req.body.token })
    if (!token) {
      res.status(400).json({
        message: 'We were unable to find a valid token. Your token my have expired.'
      });
    }
    //If we found a token, find a matching user
    const candidate = await User.findOne({ email: req.body.email })
    if (!candidate) {
      res.status(400).json({
        message: 'We were unable to find a user for this token.'
      });
    }
    if (candidate.isVerified) {
      res.status(400).json({ message: 'This user has already been verified.' });
    }
    // Verify and save the user
    candidate.isVerified = true;
    candidate.save()
    //res.status(200).redirect("http://localhost:4200/login")
    res.status(200).json(candidate)
  }
  catch (e) {
    //errorHandler(res, e)
    res.status(500).json({ message: "BAD" });
  }
}

module.exports.resendTokenPost = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: 'We were unable to find a user with that email.' });
    }
    if (user.isVerified) {
      res.status(400).json({ message: 'This account has already been verified. Please log in.' });
    } else {

      // Create a verification token, save it, and send email
      const token = await new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the token
      token.save()
      res.status(200).json({ message: 'A verification email has been sent to ' + user.email + '.' });


      // Send the email
      const transporter = await nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.USER_NAME,
          pass: process.env.PASSWORD
        }
      });


      const link = `http://localhost:4200/verify/${user.email}?id=` + token.token;
      console.log("TOKEN", token.token)
      console.log(link)
      const mailOptions = {
        to: user.email,
        subject: 'Please confirm your Email account',
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
      };

      let info = await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);

        } else {
          console.log("Super", info);
        }

      });
    }
  } catch (e) {
    errorHandler(res, e)
  }
}



module.exports.checkEmail = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: 'We were unable to find a user with that email.' });
    }
    else {

      // Create a verification token, save it, and send email
      const token = await new Pass({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the token
      token.save()
      //res.status(200).json({ message: 'A verification email has been sent to ' + user.email + '.' });


      // Send the email
      const transporter = await nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.USER_NAME,
          pass: process.env.PASSWORD
        }
      });


      const link = `http://localhost:4200/change/${user.email}?id=` + token.token;
      console.log("TOKEN", token.token)
      console.log(link)
      const mailOptions = {
        to: user.email,
        subject: 'Please click this to change your Email password',
        html: "Hello,<br> Please Click on the link to change your email password.<br><a href=" + link + ">Click here to verify</a>"
      };

      let info = await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);

        } else {
          console.log("Super", info);
          res.status(200).json({ message: 'A verification email has been sent to ' + user.email + '.' });
        }

      });

    }
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.changePass = async function (req, res) {
  console.log(req.body.email)
  console.log(req.body.token)
  console.log(req.body.password)
  // Find a matching token
  try {
    const token = await Pass.findOne({ token: req.body.token })
    if (!token) {
      res.status(400).json({
        message: 'We were unable to find a valid token. Your token my have expired.'
      });
    } else {
      //If we found a token, find a matching user
      const candidate = await User.findOne({ email: req.body.email })
      if (!candidate) {
        res.status(400).json({
          message: 'We were unable to find a user for this token.'
        });
      } else {
        if (!candidate.isVerified) {
          res.status(400).json({ message: 'Your account has not been verified.' });
        } else {
          // Verify and save the user
          const salt = bcript.genSaltSync(10)
          const password = req.body.password
          candidate.password = bcript.hashSync(password, salt)
          await candidate.save()
          res.status(200).json(candidate)
        }
      }
    }
  }
  catch (e) {
    //errorHandler(res, e)
    res.status(500).json({ message: "BAD" });
  }
}


