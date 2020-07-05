const _ = require('lodash');
const SeatSvc = require('./seat');
let service = {};

service.saveObjects = (operation) => {
  let query = 'INSERT INTO Operation SET ?;',
    resultOperation = {};

  return new Promise( ( resolve, reject) => {
    dbQuery(query, operation, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resultOperation.id = result.insertId;

        if (!_.isEmpty(operation.seats)) {
          SeatSvc.saveObjects(operation.seats)
            .then(() => {
              return resolve(resultOperation)
            })
            .catch(reject);
        } else {
          resolve(resultOperation);
        }

        resolve(resultOperation);
      }
    });
  });
}

service.getOperationByReceipt = (receiptId) => {
  return new Promise((resolve, reject) => {
    let dataQuery = 'SELECT A.* ' +
          ' FROM operation A ' +
          ' WHERE A.receipt_id = ?;';

    dbQuery(dataQuery, [receiptId], (err, result) => {
      if (err) {
        printLog(err);
        return reject(err);
      }

      if (result && result.length) {
        resolve(result[0]);
      } else {
        return resolve({});
      }
    });
  });
};

service.getOperationByTransaction = (transactionId) => {
  return new Promise((resolve, reject) => {
    let dataQuery = 'SELECT A.* ' +
          ' FROM operation A ' +
          ' WHERE A.transaction_id = ?;';

    dbQuery(dataQuery, [transactionId], (err, result) => {
      if (err) {
        printLog(err);
        return reject(err);
      }

      if (result && result.length) {
        resolve(result[0]);
      } else {
        return resolve({});
      }
    });
  });
};

module.exports = service;
