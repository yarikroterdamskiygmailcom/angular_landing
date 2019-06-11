const Tariff = require('../models/Tariff')
const errorHandler = require('../utils/ErrorHandler')



module.exports.create = async function (req, res) {
  console.log(req.body)
  try {
    const tariff = await new Tariff({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      currency: req.body.currency,
      benefits: req.body.benefits
    }).save()
    res.status(201).json(tariff)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.getById = async function (req, res) {
  try {
    console.log(1, req.params.id)
    const tariff = await Tariff.findOne({ _id: req.params.id })
    res.status(200).json(tariff)
  } catch (e) {
    errorHandler(res, e)
  }
}


module.exports.getAll = async function (req, res) {
  try {
    const tariffs = await Tariff.find()
    tariffs.forEach((item, index) => {
      if (item.name === "Free") {
        const itemIndex = index;
        tariffs.splice(itemIndex, 1);
      }
      console.log("Wrong")
    })
    res.status(200).json(tariffs)
  } catch (e) {
    errorHandler(res, e)
  }
}