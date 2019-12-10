const _ = require('lodash');
const operationSvc = require('../services/operation');
const seatSvc = require('../services/seat');
let service = {};

service.getTransactions = (filter) => {
  return new Promise((resolve, reject) => {
    let dataQuery = `SELECT
      A.id,
      A.company_id,
      A.transaction_type_id,
      A.operation_type_id,
      A.bank_account_id,
      A.operation_id,
      DATE_FORMAT(A.date, '%d/%c/%Y') date,
      A.number,
      A.amount,
      A.status
      FROM transaction A
      WHERE 1 `,
    commonQuery = 'AND A.status = 1 ',
    dataParams = [];

    if (filter.id) {
      dataParams.push(filter.id);
    }

    if (filter.operation_id) {
      commonQuery += ' AND A.operation_id IN (?) ';
      dataParams.push(filter.operation_id);
    }

    if (filter.operation_type_id) {
      commonQuery += ' AND A.operation_type_id IN (?) ';
      dataParams.push(filter.operation_type_id);
    }

    // Add conditions
    dataQuery += commonQuery;

    // Add an ORDER BY sentence
    dataQuery += ' ORDER BY A.id ASC';

    // Set always an start for data
    dataQuery += ' LIMIT ?';
    dataParams.push(filter.pageStart);

    if (filter.pageCount) {
      dataQuery += ', ?';
      dataParams.push(filter.pageCount);
    } else {
      // Request 500 records at most if limit is not specified
      dataQuery += ', 500';
    }

    dataQuery += ';';

    dbQuery(dataQuery, dataParams, function (err, rows) {
      if (err) {
        printLog(err);
        return reject(err);
      }

      resolve(rows);
    });
  });
};

service.getTransaction = (transactionId) => {
  return new Promise((resolve, reject) => {
    let result,
      dataQuery = `SELECT
        A.id,
        A.company_id,
        A.transaction_type_id,
        A.operation_type_id,
        A.bank_account_id,
        A.operation_id,
        A.description,
        A.number,
        A.amount,
        DATE_FORMAT(A.date, '%d/%c/%Y') date,
        B.id operation_id
        FROM transaction A
        LEFT JOIN operation B ON A.id = B.transaction_id
        WHERE A.status = 1 AND A.id = ?`;

    dbQuery(dataQuery, [transactionId], (err, result) => {
      if (err) {
        printLog(err);
        return reject(err);
      }

      resolve(_.first(result));
    });
  })
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
    return result;
  });
};

service.saveTransaction = (transactions) => {
  let query = 'INSERT INTO transaction SET ?;';

  return new Promise( ( resolve, reject) => {
    dbQuery(query, transactions, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        console.log(rows);
        resolve(rows);
      }
    });
  });
};

module.exports = service;
