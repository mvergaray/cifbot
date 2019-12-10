const _ = require('lodash');
let extend = require('util')._extend;
let seatSvc = require('../services/seat');
let Controller = {};

/**
 * Receipt Object
 *
 * id
 * receipt_id
 * description
 */

Controller.getObjects = (req, res) => {
  let receipt = {
      id: req.query.id,
      name: req.query.name,
    },
    filter = {
      pageStart: parseInt(req.query.skip || 0, 10),
      pageCount: parseInt(req.query.limit || 0, 10),
      orderBy: ''
    },
    dataQuery = 'SELECT a.* FROM Operation a WHERE 1 ',
    countQuery = 'SELECT COUNT(a.id) AS COUNTER FROM operation a WHERE 1 ',
    commonQuery = 'AND a.status = 1 ',
    dataParams = [],
    countParams = [];

  // Set order expression
  if (req.query.sort) {
  filter.orderBy = req.query.sort + ' ' + req.query.sort_dir;
  }

  if (receipt.id) {
    commonQuery += 'AND a.receipt_id IN (?) ';
    dataParams.push(receipt.id);
  }

  // Counter doesn't need exta params so make a copy of data params at this point
  countParams = extend([], dataParams);
  // Add conditions
  dataQuery += commonQuery;
  countQuery += commonQuery;

  // Add an ORDER BY sentence
  dataQuery += ' ORDER BY ';
  if (filter.orderBy) {
    dataQuery += filter.orderBy;
  } else {
    dataQuery += 'a.id ASC';
  }

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
  countQuery += ';';

  // Execute both queries at once
  dataParams = dataParams.concat(countParams);

  dbQuery(dataQuery + countQuery, dataParams, function (err, rows) {
    let operation = {};

    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    operation = rows[0];

    //rows = rows || [{}];
    seatSvc.getList({ operation_id: operation.id })
      .then((seats) => {
        operation.seats = seats;
        res.json({
          results: {
            list:rows[0],
            count: rows[1][0].COUNTER
          }
        });
      })
      .catch((err) => {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return;
      });
  });
};

Controller.saveObject = (req, res) => {
  var operationBP = req.body,
    operation = {};

  operation.receipt_id = operationBP.receipt_id;
  operation.description = operationBP.description;

  // Set default values
  operation.status = 1;
  operation.created_at = new Date();
  operation.created_by = req.user && req.user.id || -1;

  dbQuery('INSERT INTO Operation SET ?;', operation, function (err, result) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    res.json({result: {code: '001', message: 'ok', id: result.insertId}});
  });
};

Controller.saveObjects = (operation) => {
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
};

Controller.getObject = (req, res) => {
  var receiptId = req.params.id,
      dataQuery = 'SELECT R.* ' +
        'FROM Receipt O  ' +
        'WHERE O.STATUS = 1 AND O.ID = ?;';

  dbQuery(dataQuery, [receiptId], function (err, result) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    if (result && result.length) {
      res.status(200).json(result[0]);
    } else {
      res.status(500).send({code: 500, msg: 'Receipt not found'});
    }
  });
};

Controller.updateObject = (req, res) => {
  var id = req.params.id,
      operationBP = req.body,
      operation = {};

  operation.receipt_id = operationBP.receipt_id;
  operation.description = operationBP.description;

  dbQuery('UPDATE Operation SET ? WHERE ID = ?;', [operation, id],
    function (err) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return;
      }

      res.json({result: {code: '001', message: 'ok'}});
    });
};

Controller.deleteObject = (req, res) => {
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

module.exports = Controller;
