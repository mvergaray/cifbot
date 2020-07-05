const express = require('express');
const router = express.Router();
const accountingSetCtrl = require('../controllers/acountingSet');

router.get('/', accountingSetCtrl.getObjects);
router.post('/', accountingSetCtrl.saveObject);

router.get('/:id', accountingSetCtrl.getObject);
router.put('/:id', accountingSetCtrl.updateObject);
//  router.delete('/:id', accountingSetCtrl.deleteObject);

module.exports = router;
