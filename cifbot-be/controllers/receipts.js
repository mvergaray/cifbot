let ReceiptCtrl = {};
let OperationSvc = require('./operation');
let receiptSvc = require('../services/receipt');
let operationSvc = require('../services/operation');
let seatSvc = require('../services/seat');

/**
 * Receipt Object
 *
 * id
 * company_id
 * operation_id
 * assoc_company_id
 * serie
 * doc_number
 * date
 * due_date
 * period
 * description
 * tax_base
 * tax_percentage
 * tax_value
 * exchange_id
 * exchange_value
 * detraction
 * created_by
 * created_at
 * updated_by
 * updated_at
 */

ReceiptCtrl.getObjects = (req, res) => {
  let filter = {
      id: req.query.id,
      search: req.query.search,
      operation_type_id: req.query.operation_type_id,
      pageStart: parseInt(req.query.skip || 0, 10),
      pageCount: parseInt(req.query.limit || 0, 10),
      orderBy: undefined
    };

  receiptSvc.getReceipts(filter)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      printLog(err);
      return res.status(500).send({code: 500, msg: 'Error fetching receipts', dev: err });
    });
};

ReceiptCtrl.saveObjects = (req, res) => {
  var receiptBP = req.body,
    receipt = {};

    receipt.company_id = receiptBP.company_id;
    receipt.operation_type_id = receiptBP.operation_type_id;
    receipt.assoc_company_id = receiptBP.assoc_company_id;
    receipt.serie = receiptBP.serie;
    receipt.doc_number = receiptBP.doc_number;
    receipt.date = receiptBP.date;
    receipt.due_date = receiptBP.due_date;
    receipt.period = receiptBP.period;
    receipt.description = receiptBP.description;
    receipt.tax_base = receiptBP.tax_base;
    receipt.tax_percentage = receiptBP.tax_percentage;
    receipt.tax_value = receiptBP.tax_value;
    receipt.exchange_id = receiptBP.exchange_id;
    receipt.exchange_value = receiptBP.exchange_value;
    receipt.detraction = receiptBP.detraction;

  // Set default values
  receipt.status = 1;
  receipt.created_at = new Date();
  receipt.created_by = req.user && req.user.id || -1;
console.log('object to save in save objects receipts');
console.log(receipt);
  dbQuery('INSERT INTO receipt SET ?;', receipt, function (err, result) {
    let operation = {};

    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    /*
     * After the receipt is created
     * Call Operation service in order to save Operation and Seat data
     */
    operation.receipt_id = result.insertId;
    operation.description = receiptBP.description;
    operation.status = 1;
    operation.created_at = new Date();
    operation.created_by = req.user && req.user.id || -1;

    OperationSvc.saveObjects(operation)
      .then((operationCreated) => {
        let taxableAmountSeat = {
            plan_id: 645, // Acc plan code: 70111,
            value: receipt.tax_base,
            operation_id: operationCreated.id,
            status: 1
          },
          taxAmountSeat = {
            plan_id: 1692, // Acc plan code: 40111,
            value: receipt.tax_percentage,
            operation_id: operationCreated.id,
            status: 1
          },
          totalAmountSeat = {
            value: receiptBP.total_amount,
            operation_id: operationCreated.id,
            status: 1
          },
          seatsList = [];


        /**
         * Any receipt should have at least three accountant seats
         * 1. For the taxable ammount (debit or credit regarding the operation type)
         * 2. For the tax ammount
         * 3. Counterpart of the above ammounts
         */
        if (receipt.operation_type_id === 1) {
          totalAmountSeat.condition = 1;
          totalAmountSeat.plan_id = 1758; // Acc plan code: 4212;
          taxAmountSeat.condition = 0;
          taxableAmountSeat.plan_id = 265, // Acc plan code: 70111,
          taxableAmountSeat.condition = 0;
        } else {
          totalAmountSeat.condition = 0;
          totalAmountSeat.plan_id = 920; // Acc plan code: 1212;
          taxAmountSeat.condition = 1;
          taxableAmountSeat.plan_id = 645, // Acc plan code: 70111,
          taxableAmountSeat.condition = 1;
        }

        seatsList.push(seatSvc.saveSeat(taxableAmountSeat));
        seatsList.push(seatSvc.saveSeat(taxAmountSeat));
        seatsList.push(seatSvc.saveSeat(totalAmountSeat));

        Promise.all(seatsList)
          .then(() => {
            res.json({result: {code: '001', message: 'ok', id: result.insertId}});
          })
      })
      .catch((err) => {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return
      });
  });
};

ReceiptCtrl.getObject = (req, res) => {
  let receiptId = req.params.id,
    result = {};

  receiptSvc.getReceipt(receiptId)
    .then((receipt) => {
      result = receipt;
      return operationSvc.getOperationByReceipt(receipt.id);
    })
    .then((operation) => {
      result.operation = operation;
      return seatSvc.getList({ operation_id: operation.id });
    })
    .then((seats) => {
      result.seats = seats;
      return res.status(200).json(result);
    })
    .catch((err) => {
      printLog(err);
      return res.status(500).send({code: 500, msg: 'Error fetching receipt', dev: err });
    });
};

ReceiptCtrl.updateObject = (req, res) => {
  var id = req.params.id,
      receiptBP = req.body,
      receipt = {};

    receipt.company_id = receiptBP.company_id;
    receipt.operation_id = receiptBP.operation_id;
    receipt.assoc_company_id = receiptBP.assoc_company_id;
    receipt.serie = receiptBP.serie;
    receipt.doc_number = receiptBP.doc_number;
    receipt.date = receiptBP.date;
    receipt.due_date = receiptBP.due_date;
    receipt.period = receiptBP.period;
    receipt.description = receiptBP.description;
    receipt.tax_base = receiptBP.tax_base;
    receipt.tax_percentage = receiptBP.tax_percentage;
    receipt.tax_value = receiptBP.tax_value;
    receipt.exchange_id = receiptBP.exchange_id;
    receipt.exchange_value = receiptBPreceipt.exchange_value;
    receipt.detraction = receiptBP.detraction;

  // Set default values
  receipt.updated_at = new Date();
  receipt.updated_by = req.user && req.user.id || -1;

  dbQuery('UPDATE Receipt SET ? WHERE ID = ?;', [receipt, id],
    function (err) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return;
      }

      res.json({result: {code: '001', message: 'ok'}});
    });
};

ReceiptCtrl.deleteObject = (req, res) => {
  var id = req.params.id,
    receipt = {
      // Set default values
      status: -1,
      updated_at: new Date(),
      updated_by: req.user && req.user.id || -1
    };

  dbQuery('UPDATE Receipt SET ? WHERE ID = ?;', [receipt, id], function (err) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    res.json({result: {code: '001', message: 'ok'}});
  });
};

module.exports = ReceiptCtrl;
