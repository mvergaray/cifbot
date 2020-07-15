const _ = require('lodash');
let extend = require('util')._extend;
let Controller = {};

/**
 * Seat Object
 *
 * id
 * operation_id
 * plan_id
 * condition
 * value
 * created_at
 * created_by
 */

Controller.getObjects = (req, res) => {
  let seat = {
      id: req.query.id,
      name: req.query.name,
    },
    filter = {
      pageStart: parseInt(req.query.skip || 0, 10),
      pageCount: parseInt(req.query.limit || 0, 10),
      orderBy: ''
    },
    dataQuery = 'SELECT * FROM accseat A WHERE 1 ',
    countQuery = 'SELECT COUNT(A.id) AS COUNTER FROM operation A WHERE 1 ',
    commonQuery = 'AND A.STATUS = 1 ',
    dataParams = [],
    countParams = [];

  // Set order expression
  if (req.query.sort) {
  filter.orderBy = req.query.sort + ' ' + req.query.sort_dir;
  }

  if (seat.id) {
  commonQuery += 'AND A.ID IN (?) ';
  dataParams.push(seat.id);
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
  dataQuery += 'A.ID ASC';
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
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    rows = rows || [{}];

    res.json({
      results: {
        list:rows[0],
        count: rows[1][0].COUNTER
      }
    });
  });
};

Controller.saveObject = (req, res) => {
  var seatBP = req.body,
      seat = {};

  seat.operation_id = seatBP.operation_id;
  seat.plan_id = seatBP.plan_id;
  seat.condition = seatBP.condition;
  seat.value = seatBP.value;

  // Set default values
  seat.created_at = new Date();
  seat.created_by = req.user && req.user.id || -1;

  dbQuery('INSERT INTO accseat SET ?;', seat, function (err, result) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    res.json({result: {code: '001', message: 'ok', id: result.insertId}});
  });
};

Controller.getObject = (req, res) => {
  let seatId = req.params.id,
      dataQuery = 'SELECT A.* ' +
        ' FROM accseat A ' +
        ' WHERE A.ID = ?;';

  dbQuery(dataQuery, [seatId], function (err, result) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    if (result && result.length) {
      res.status(200).json(result[0]);
    } else {
      res.status(500).send({code: 500, msg: 'Seat not found'});
    }
  });
};

Controller.updateObject = (req, res) => {
  var id = req.params.id,
      seatBP = req.body,
      seat = {};

  seat.operation_id = seatBP.operation_id;
  seat.plan_id = seatBP.plan_id;
  seat.condition = seatBP.condition;
  seat.value = seatBP.value;

  dbQuery('UPDATE AccSeat SET ? WHERE ID = ?;', [seat, id],
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
  seat = {
      // Set default values
      status: -1,
      updated_at: new Date(),
      updated_by: req.user && req.user.id || -1
    };

  dbQuery('UPDATE AccSeat SET ? WHERE ID = ?;', [seat, id], function (err) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    res.json({result: {code: '001', message: 'ok'}});
  });
};

module.exports = Controller;
