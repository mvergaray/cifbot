const extend = require('util')._extend;
let Controller = {};

Controller.handleWebhook = (req, res) => {
  console.log('handle webhook');
  console.log('WH Body:');
  console.log(req.body);
  console.log('WH Query:');
  console.log(req.query);
  console.log('WH Params:');
  console.log(req.params);
  return res.status(200).send('handleWebhook - GET');
};

Controller.handleWebhookPost = (req, res) => {
  console.log('handle webhook post');
  console.log('WH Body:');
  console.log(req.body);
  console.log('WH Query:');
  console.log(req.query);
  console.log('WH Params:');
  console.log(req.params);
  return res.status(200).send('handleWebhook - POST');
};

module.exports = Controller;