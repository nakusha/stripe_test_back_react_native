'use strict';
var express = require('express');
var router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51IBtHIGU6n2jo0139xXNhXe2Fs1dTUexLFgUd3VLf1dc2YGModWyWtW72ueoe8asLbnOvCnoS41rzBBAWjxjkvYl00jPk6k0J6');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/createCustomer', async (req, res) => {
  const result = await stripe.customers.create({
    email:req.body.email,
    payment_method:req.body.pm,
    invoice_settings: {
      default_payment_method: req.body.pm,
    },
  })
  res.json(result)
})

router.post('/createPrice', async (req, res) => {
  const result = await stripe.prices.create({
    unit_amount: req.body.amount,
    currency: 'eur',
    recurring: {
      interval: 'month',
    },
    product_data:{
      name: req.body.name
    }, 
  });
  res.json(result)
})

router.post('/createSubscription', async (req, res) => {
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customer,
    items: [{
      price: req.body.price,
    }],
    // add_invoice_items: [{
    //   price: '{{PRICE_ID}}',
    // }],
  }); 

  res.json(subscription)
})

router.post('/createSubSchedule', async (req, res) => {
  const subscriptionSchedule = await stripe.subscriptionSchedules.create({
    customer: req.body.customer,
    start_date: req.body.start_date,
    end_behavior: 'release',
    phases: [
      {
        items: [
          {
            price: req.body.price,
            quantity: 1,
          },
        ],
        iterations: req.body.iterations,
        // add_invoice_items: [
        //   {
        //     price: '{{PRICE_ID}}',
        //   }
        // ],
      },
    ],
  });

  res.json(subscriptionSchedule)
})

router.get('/getSubscription', async (req, res) => {
  const subscription = await stripe.subscriptions.retrieve(req.params.id);
  console.log(subscription);
  res.json(subscription);
})

module.exports = router;