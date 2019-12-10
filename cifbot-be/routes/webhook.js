const express = require('express');
const router = express.Router();
const controller = require('../controllers/webhook');

router.post('/', controller.handleWebhookPost);
router.get('/', controller.handleWebhook);

module.exports = router;
