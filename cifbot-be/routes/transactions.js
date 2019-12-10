const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactions');

router.post('/', controller.saveObjects);
router.get('/', controller.getObjects);

router.get('/:id', controller.getObject);

module.exports = router;
