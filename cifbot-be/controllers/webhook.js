const extend = require('util')._extend;
let Controller = {};

Controller.handleWebhook = (req, res) => {
  console.log('handle webhook');
  console.log(req);
  return res.status(200).send('handleWebhook - GET');
};

Controller.handleWebhookPost = (req, res) => {
  console.log('handle webhook post');
  console.log(req);
  return res.status(200).send('handleWebhook - POST');
};

module.exports = Controller;