const _ = require('lodash');
let extend = require('util')._extend;
let service = {};

service.getCompanies = (filter) => {
  return new Promise ((resolve, reject) => {
    let dataQuery = `SELECT
        a.*,
        b.id provider_id,
        b.detraction,
        b.type provider_type,
        c.id client_id,
        c.type client_type
        FROM company a
        LEFT JOIN companyprovider b
        ON b.provider_company_id = a.id
        LEFT JOIN companyclient c
        ON c.client_company_id = a.id
        WHERE 1 `,

      countQuery = `SELECT COUNT(a.id) AS COUNTER FROM company a
      LEFT JOIN companyprovider b
      ON b.provider_company_id = a.id
      LEFT JOIN companyclient c
      ON c.client_company_id = a.id
      WHERE 1 `,

      commonQuery = ' ',
      dataParams = [],
      countParams = [];

    if (filter.id) {
      commonQuery += 'AND a.id IN (?) ';
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
      dataQuery += 'a.id ASC ';
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
        return reject(err);
      }
      if (rows && rows.length) {
        resolve({
          results: {
            list: rows[0],
            count: rows[1][0].COUNTER
          }
        });
      } else {
        return reject({code: 500, msg: 'Companies not found'})
      }
    });
  });
};

service.getCompany = (clientId) => {
  return new Promise((resolve, reject) => {
    let dataQuery = `SELECT A.*
      FROM company A
      WHERE A.id = ?;`;

    dbQuery(dataQuery, [clientId], (err, result) => {
      if (err) {
        printLog(err);
        return reject(err);
      }

      console.log('debugger');
      console.log(result);
      if (result && result.length) {
        resolve(result[0]);
      } else {
        return reject({code: 500, msg: 'Company not found'});
      }
    });
  });
};


module.exports = service;
