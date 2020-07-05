const express = require('express');
const router = express.Router();
const providerCtrl = require('../controllers/providers');

router.get('/', providerCtrl.getObjects);
//router.post('/', clientCtrl.saveObjects);

router.get('/:id', providerCtrl.getObject);
//router.put('/:id', clientCtrl.updateObject);
//  router.delete('/:id', clientCtrl.deleteObject);

module.exports = router;
