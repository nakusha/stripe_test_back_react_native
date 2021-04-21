'use strict';
var express = require('express');
var router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51IBtHIGU6n2jo0139xXNhXe2Fs1dTUexLFgUd3VLf1dc2YGModWyWtW72ueoe8asLbnOvCnoS41rzBBAWjxjkvYl00jPk6k0J6');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/createPaymentMethod',async (req, res) => {
  
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: req.body.number,
      exp_month: req.body.exp_month,
      exp_year: req.body.exp_year,
      cvc: req.body.cvc,
    },
  });
  res.json(paymentMethod)
});

router.post('/createPaymentIntent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount:10000,
    currency: 'eur',
    payment_method:req.body.pm
  });

  res.json(paymentIntent)
});

router.get('/paymentIntent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(req.query.id);

  res.json(paymentIntent)
})

router.get('/refundPayment', async (req, res) => {
  const refund = await stripe.refunds.create({
    payment_intent: req.query.id,
  });
  res.json(refund)
})

module.exports = router;