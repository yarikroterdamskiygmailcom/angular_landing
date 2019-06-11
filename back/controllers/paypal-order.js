var paypal = require('paypal-rest-sdk');
const errorHandler = require('../utils/ErrorHandler');
const Order = require('../models/Order');

const Profile = require('../models/Profile')


paypal.configure({
  mode: 'sandbox', // Sandbox or live
  client_id: 'AX0iUXLaZovYw-vqyEwHYofZooXCllutOi4vme6xbhsE9zVrUi6Ok495DVRiq8TPtR9AaFhUH7zLfklE',
  client_secret: 'EFR4fTF2EJNzttav9RpdDOUf4xXCoHoIFlD6j09oPrCO2tNyoi_yymWfNkrPoDnydbuO0SsfbmNfzFCs'
});

//const order2 = {};
module.exports.order = async function (req, res) {

  console.log('00000', req.body.card.user)
  // create payment object 
  try {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        //"return_url": `http://localhost:4000/matches/paypal/result/${req.body.card.user}/${req.body.card.price}/${req.body.card.tariff}`,
        "return_url": `http://localhost:4200/result/${req.body.card.user}/${req.body.card.price}/${req.body.card.tariff}`,
        "cancel_url": `http://localhost:4200/tariff/${req.body.card.user}`
      },
      "transactions": [{
        "amount": {
          "total": req.body.card.price,
          "currency": "USD"
        },
        "payment_options": {
          "allowed_payment_method": "IMMEDIATE_PAY"
        },
        "description": req.body.card.description
      }]
    };
    const result = await createPay(create_payment_json)



    var id = result.id;
    var links = result.links;
    var counter = links.length;
    let approvalUrl = '';
    while (counter--) {
      if (links[counter].method == 'REDIRECT') {
        // redirect to paypal where user approves the transaction 
        approvalUrl = links[counter].href
      }
    }

    res.status(200).json({ url: approvalUrl })

  } catch (e) {
    errorHandler(res, e)
  }
}

var createPay = (payment) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, function (err, payment) {
      if (err) {
        reject(err);
      }
      else {
        resolve(payment);
      }
    });
  });
}

module.exports.result = async function (req, res) {

  try {
    var query = req.params;
    const paymentId = query.paymentId;
    const payerId = { payer_id: query.payerID };
    console.log(2, req.params.user)
    console.log(2, req.params.price)
    console.log(2, req.params.tariff)
    console.log(2, paymentId)
    console.log(2, payerId)


    await paypal.payment.execute(paymentId, payerId, function (error, payment) {


      if (error) {
        console.error(JSON.stringify(error));
      } else {
        if (payment.state == 'approved') {
          const order = new Order()
          order.user = req.params.user;
          order.price = req.params.price;
          order.tariff = req.params.tariff

          order.save()

          Profile.findOneAndUpdate(
            { user: req.params.user },
            { $set: { tariffPlan: req.params.tariff } },
            { new: true })
            .exec()
            .then(doc => {
              console.log(doc);
              if (doc.nModified != 0) {
                const updatedProfile = doc;
                res.status(200).json(updatedProfile)

              } else {
                res.status(404)
              }
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({ err });
            });


          console.log('payment completed successfully');
          //res.status(200).json({message: "Success"})

        } else {
          console.log('payment not successful');
        }
      }

    });

  } catch (e) {
    errorHandler(res, e)
  }

}




