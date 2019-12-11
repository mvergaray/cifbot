const _ = require('lodash');
const operationSvc = require('../services/operation');
const seatSvc = require('../services/seat');
const transactionSvc = require('../services/transaction');

let Controller = {};

/**
 * Transaction Object
 *
 * id
 * transaction_type_id
 * operation_type_id
 * bank_account_id
 * operation_id
 * amount
 * date
 * number
 * description
 * status
 */

Controller.getObjects = (req, res) => {
  let filter = {
      operation_id: req.query.operation_id,
      pageStart: parseInt(req.query.skip || 0, 10),
      pageCount: parseInt(req.query.limit || 0, 10),
      orderBy: undefined
    }
    result = {};

  transactionSvc.getTransactions(filter)
    .then((result) => {
      let transactions = [];

      console.log('transactions result');
      console.log(result)
      _.each(result, (transaction) => {
        transactions.push(transactionSvc.getTransaction(transaction.id));
      })

      return Promise.all(transactions);
    })
    .then((transactions) => {
      console.log('todas las transaction');
      console.log(transactions);
      return res.status(200).json({
        results: {
          list: transactions
        }
      });
    })
    .catch((err) => {
      printLog(err);
      return res.status(500).send({code: 500, msg: 'Error fetching transactions', dev: err });
    });
};

Controller.getObject = (req, res) => {
  let transactionId = req.params.id,
    result = {};

  transactionSvc.getTransaction(transactionId)
    .then((transaction) => {
      result = transaction;
      return operationSvc.getOperationByTransaction(transaction.id);
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
      return res.status(500).send({code: 500, msg: 'Error fetching transaction', dev: err });
    });
};

Controller.saveObjects = (req, res) => {
  let transactionBP = req.body,
    transaction = {},
    operation = {};

  transaction.company_id = transactionBP.company_id;
  transaction.transaction_type_id = transactionBP.transaction_type_id;
  transaction.operation_type_id = transactionBP.operation_type_id;
  transaction.bank_account_id = transactionBP.bank_account_id;
  transaction.operation_id = transactionBP.operation_id;
  transaction.amount = transactionBP.amount;
  transaction.number = transactionBP.number;
  transaction.date = transactionBP.date;
  transaction.description = transactionBP.description;

  // Set default values
  transaction.status = 1;
  transaction.created_at = new Date();
  transaction.created_by = req.user && req.user.id || -1;

  transactionSvc.saveTransaction(transaction)
    .then((result) => {
      /*
      * After the receipt is created
      * Call Operation service in order to save Operation and Seat data
      */
      operation.transaction_id = result.insertId;
      operation.description = transaction.description;
      operation.status = 1;
      operation.created_at = new Date();
      operation.created_by = req.user && req.user.id || -1;

      return operationSvc.saveObjects(operation);
    })
    .then((operationCreated) => {
      let amountSeat = {
          plan_id: 866, // Acc plan code: 10,
          condition: 0,
          value: transactionBP.amount,
          operation_id: operationCreated.id,
          status: 1
        },
        transactionAmountSeat = {
          plan_id: 920, // Acc plan code: 1212;
          condition: 1,
          value: transactionBP.amount,
          operation_id: operationCreated.id,
          status: 1
        },
        seatsList = [];

      seatsList.push(seatSvc.saveSeat(amountSeat));
      seatsList.push(seatSvc.saveSeat(transactionAmountSeat));

      console.log(seatsList);

      return Promise.all(seatsList);
    })
    .then(() => {
      res.json({ result: { code: '001', message: 'ok', id: operation.transaction_id } });
    })
    .catch((err) => {
      printLog(err);
      return res.status(500).send({code: 500, msg: 'Error saving transaction', dev: err });
    });
};

module.exports = Controller;
