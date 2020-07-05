const _ = require('lodash');
let extend = require('util')._extend;
let Controller = {};

/**
 * Account Object
 *
 * id
 * acc_number
 * acc_desc
 * container
 * created_at
 * created_by
 * updated_at
 * updated_by
 */

Controller.getObjects = (req, res) => {
  let account = {
      id: req.query.id,
      acc_desc: `%${req.query.search}%`
    },
    filter = {
      pageStart: parseInt(req.query.skip || 0, 10),
      pageCount: parseInt(req.query.limit || 0, 10),
      orderBy: ''
    },
    dataQuery = `SELECT
      id,
      acc_number,
      acc_desc,
      status,
      created_at,
      created_by,
      RPAD(acc_number, 6, '0') account
      FROM accplan A WHERE 1 `,
    countQuery = 'SELECT COUNT(A.id) AS COUNTER FROM accplan A WHERE 1 ',
    commonQuery = 'AND A.STATUS = 1 ',
    dataParams = [],
    countParams = [];

  // Set order expression
  if (req.query.sort) {
  filter.orderBy = req.query.sort + ' ' + req.query.sort_dir;
  }

  if (account.id) {
    commonQuery += 'AND A.ID IN (?) ';
    dataParams.push(account.id);
  }

  if (account.acc_desc) {
    commonQuery += 'AND A.acc_desc LIKE ? ';
    dataParams.push(account.acc_desc);
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
  dataQuery += 'A.acc_number ASC';
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
  var accountBP = req.body,
    account = {};

  account.acc_number = accountBP.acc_number;
  account.acc_desc = accountBP.acc_desc;

  // Set default values
  account.created_at = new Date();
  account.created_by = req.user && req.user.id || -1;

  dbQuery('INSERT INTO accplan SET ?;', account, function (err, result) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    res.json({result: {code: '001', message: 'ok', id: result.insertId}});
  });
};

Controller.getObject = (req, res) => {
  let accountId = req.params.id,
      dataQuery = 'SELECT A.* ' +
        ' FROM accplan A ' +
        ' WHERE A.ID = ?;';

  dbQuery(dataQuery, [accountId], function (err, result) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    if (result && result.length) {
      res.status(200).json(result[0]);
    } else {
      res.status(500).send({code: 500, msg: 'Cuenta contable no encontrada.'});
    }
  });
};

Controller.updateObject = (req, res) => {
  var id = req.params.id,
      accountBP = req.body,
      account = {};

  account.acc_number = accountBP.acc_number;
  account.acc_desc = accountBP.acc_desc;

  dbQuery('UPDATE accplan SET ? WHERE ID = ?;', [account, id],
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
    account = {
      // Set default values
      status: -1,
      updated_at: new Date(),
      updated_by: req.user && req.user.id || -1
    };

  dbQuery('UPDATE accplan SET ? WHERE ID = ?;', [account, id], function (err) {
    if (err) {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
      return;
    }

    res.json({result: {code: '001', message: 'ok'}});
  });
};

module.exports = Controller;
