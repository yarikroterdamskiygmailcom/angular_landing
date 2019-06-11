const Profile = require('../models/Profile')
const errorHandler = require('../utils/ErrorHandler')
const fs = require('fs')




module.exports.update = async function (req, res) {
  try {



    const currentProfile = await Profile.findOne({ user: req.params.id })
    const imageSrc = req.file ? req.file.path : currentProfile.imageSrc;




    const updatedProfile = {
      gender: req.body.gender,
      userName: req.body.userName,
      birthDate: req.body.birthDate,
      user: req.params.id,
      timeZone: req.body.timeZone,
      imageSrc: imageSrc
    };


    const profile = await Profile.findOneAndUpdate(
      { user: req.params.id },
      { $set: updatedProfile },
      { new: true }
    )


    if (req.file && currentProfile.imageSrc !== "") {
      fs.unlink(`${currentProfile.imageSrc}`, (err) => {
        if (err) throw err;
        console.log('was deleted');
      });
    }

    res.status(200).json(profile)


  } catch (e) {
    errorHandler(res, e)
  }
}


module.exports.get = async function (req, res) {
  try {
    const profile = await Profile.findOne({ user: req.params.user })
    res.status(200).json(profile)
  } catch (e) {
    errorHandler(res, e)
  }
}
