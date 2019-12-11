const express = require('express');
const router = express.Router();
const controller = require('../controllers/webhook');

router.post('/', controller.handleWebhookPost);
router.get('/', controller.handleWebhookPost);
router.get('/calendar', controller.getCalendar);

module.exports = router;
