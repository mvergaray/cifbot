const express = require('express');
const router = express.Router();
const companyCtrl = require('../controllers/company');

router.get('/', companyCtrl.getObjects);
router.post('/', companyCtrl.saveObject);

router.get('/:id', companyCtrl.getObject);
router.put('/:id', companyCtrl.updateObject);
//  router.delete('/:id', companyCtrl.deleteObject);

module.exports = router;
