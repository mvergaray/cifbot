let extend = require('util')._extend;
let companySvc = require('../services/company')
let Controller = {};
/**
 * GET    /clients/ list of active clients
 * POST   /clients/ save a new client
 */

/**
 * Client Object
 *
 */

Controller.getObjects = (req, res) => {
  let filter = {
      id: req.query.id,
      description: req.query.description,
      pageStart: parseInt(req.query.skip || 0, 10),
      pageCount: parseInt(req.query.limit || 0, 10),
      orderBy: ''
    },

    dataQuery = `SELECT b.* FROM companyclient a
      LEFT JOIN company b
      ON a.client_company_id = b.id WHERE 1`,

    countQuery = `SELECT COUNT(a.id) AS COUNTER FROM companyclient a
      LEFT JOIN company b
      ON a.client_company_id = b.id WHERE 1 `,

    commonQuery = ' ',
    dataParams = [],
    countParams = [];

  // Set order expression
  if (req.query.sort) {
    filter.orderBy = req.query.sort + ' ' + req.query.sort_dir;
  }

  if (filter.id) {
    commonQuery += 'AND b.id IN (?) ';
    dataParams.push(filter.id);
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
    dataQuery += 'b.id ASC ';
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

  dbQuery(dataQuery + countQuery, dataParams, (err, rows) => {
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

Controller.getObject = (req, res) => {
  const client_id = req.params.id;

  companySvc.getCompany(client_id)
    .then((client) => {
      return res.status(200).json(client);
    })
    .catch((err) => {
      printLog(err);
      res.status(500).send({code: 500, msg: 'Error fetching ', dev: err});
    });
};

module.exports = Controller;
