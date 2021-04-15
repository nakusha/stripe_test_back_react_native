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
  let data = {
    unit_amount: req.body.amount,
    currency: 'eur',
    product_data:{
      name: req.body.name
    }, 
  }
  // recurring: {
  //   interval: 'month',
  // },
  req.body.isRecurring ? data.recurring = {interval:req.body.interval} : null;
  const result = await stripe.prices.create(data);
  res.json(result)
})


router.post('/createSubscription', async (req, res) => {
  const data = req.body.deposit ? 
  {
    customer: req.body.customer,
    items: [{
      price: req.body.price,
    }],
    add_invoice_items: [{
      price: req.body.deposit,
    }],
    off_session:true,
  }
  :
  {
    customer: req.body.customer,
    items: [{
      price: req.body.price,
    }],
    off_session:true,
  };

  const subscription = await stripe.subscriptions.create(data); 

  res.json(subscription)
})

router.post('/createSubSchedule', async (req, res) => {
  const data = req.body.deposit ? 
  {
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
        add_invoice_items: [
          {
            price: req.body.deposit,
          }
        ],
      },
    ],
  }
  :
  {
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
      },
    ],
  };

  const subscriptionSchedule = await stripe.subscriptionSchedules.create(data);

  res.json(subscriptionSchedule)
})

router.get('/getSubscription', async (req, res) => {
  const subscription = await stripe.subscriptions.retrieve(req.query.id);
  console.log(subscription);
  res.json(subscription);
})

router.get('/getInvocie', async (req, res) => {
  const invoice = await stripe.invoices.retrieve(req.query.id);
  res.json(invoice)
})

module.exports = router;