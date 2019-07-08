const stripe = require('stripe')(process.env.STRIPE_KEY);
const errorHandler = require('../utils/ErrorHandler');
const Tariff = require('../models/Tariff');
const Order = require('../models/Order')
const Profile = require('../models/Profile')



module.exports.order = async function (req, res) {

  try {
    const stripeToken = req.body.card.stripeToken

    const currentCharges = req.body.card.price * 100

    const result = await stripe.customers
      .create({
        source: stripeToken.id
      });
    const charge = await stripe.charges.create({
      amount: currentCharges,
      currency: "EUR",
      customer: result.id
    });

    const order = new Order()
    order.user = req.body.card.user;
    order.price = currentCharges;
    order.tariff = req.body.card.tariff
    console.log(req.body.card.user);
    console.log(req.body.card.tariff);
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.body.card.user },
      { $set: { tariffPlan: req.body.card.tariff } },
      { new: true })

    console.log(updatedProfile)


    await order.save()
    res.status(201).json(order)
  } catch (e) {
    errorHandler(res, e)
  }
};

