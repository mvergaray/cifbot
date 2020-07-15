const _ = require('lodash');
let service = {};

service.getList = (params) => {
  let filter = {
        pageStart: parseInt(params.skip || 0, 10),
        pageCount: parseInt(params.limit || 0, 10),
        orderBy: ''
      },
      dataQuery = `SELECT
        A.id,
        A.operation_id,
        A.plan_id,
        A.condition,
        A.value,
        A.status,
        b.acc_number,
        b.acc_desc

        FROM accseat A
        LEFT JOIN accplan b ON A.plan_id = b.id
        WHERE 1 `,
      commonQuery = 'AND A.STATUS = 1 ',
      dataParams = [];

  // Set order expression
  if (params.sort) {
    filter.orderBy = params.sort + ' ' + params.sort_dir;
  }

  if (params.operation_id) {
    commonQuery += 'AND a.operation_id IN (?) ';
    dataParams.push(params.operation_id);
  }
  // Counter doesn't need exta params so make a copy of data params at this point

  // Add conditions
  dataQuery += commonQuery;

  // Add an ORDER BY sentence
  dataQuery += ' ORDER BY ';
  if (filter.orderBy) {
    dataQuery += filter.orderBy;
  } else {
    dataQuery += 'a.id DESC';
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

  return new Promise((resolve, reject) => {
    dbQuery(dataQuery, dataParams, function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

service.saveSeat = (seats) => {
  let query = 'INSERT INTO accseat SET ?;';

  return new Promise( ( resolve, reject) => {
    dbQuery(query, seats, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(_.first(rows));
      }
    });
  });
};

module.exports = service;
