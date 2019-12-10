let extend = require('util')._extend;
let service = {};

service.getReceipts = (filter) => {
  return new Promise((resolve, reject) => {
    let dataQuery = `SELECT
      A.id,
      A.company_id,
      A.operation_type_id,
      A.assoc_company_id,
      A.serie,
      A.doc_number,
      A.status,
      A.description,
      DATE_FORMAT(A.date, '%d/%c/%Y') date,
      DATE_FORMAT(A.due_date, '%d/%c/%Y') due_date,
      DATE_FORMAT(A.date, '%d/%c/%Y') period,
      A.tax_base,
      A.tax_percentage,
      A.tax_value,
      (A.tax_base + A.tax_value) total_amount,
      B.name assoc_company_name
      FROM receipt A
      LEFT JOIN company B ON A.assoc_company_id = B.id
      WHERE 1 `,
    countQuery = 'SELECT COUNT(A.id) AS COUNTER FROM receipt A WHERE 1 ',
    commonQuery = 'AND A.status = 1 ',
    dataParams = [],
    countParams = [];

    if (filter.id) {
      commonQuery += ' AND A.id IN (?) ';
      dataParams.push(filter.id);
    }

    if (filter.operation_type_id) {
      commonQuery += ' AND A.operation_type_id IN (?) ';
      dataParams.push(filter.operation_type_id);
    }

    if (filter.search) {
      commonQuery += 'AND CONCAT_WS(serie, " - ",doc_number) LIKE ? ';
      dataParams.push('%' + filter.search.replace(/ /g, '%') + '%');
    }

    // Counter doesn't need exta params so make a copy of data params at this point
    countParams = extend([], dataParams);
    // Add conditions
    dataQuery += commonQuery;
    countQuery += commonQuery;

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
    countQuery += ';';

    // Execute both queries at once
    dataParams = dataParams.concat(countParams);

    dbQuery(dataQuery + countQuery, dataParams, function (err, rows) {
      if (err) {
        printLog(err);
        return reject(err);
      }

      if (rows && rows.length) {
        resolve({
          results: {
            list:rows[0],
            count: rows[1][0].COUNTER
          }
        });
      } else {
        return reject({ msg: 'Receipts not found' });
      }
    });
  });
};

service.getReceipt = (receiptId) => {
  return new Promise((resolve, reject) => {
    let dataQuery = `SELECT
      A.id,
      A.company_id,
      A.operation_type_id,
      A.assoc_company_id,
      A.serie,
      A.doc_number,
      A.status,
      A.description,
      DATE_FORMAT(A.date, '%d/%c/%Y') date,
      DATE_FORMAT(A.due_date, '%d/%c/%Y') due_date,
      DATE_FORMAT(A.date, '%d/%c/%Y') period,
      A.tax_base,
      A.tax_percentage,
      A.tax_value,
      (A.tax_base + A.tax_value) total_amount,
      B.id operation_id
      FROM Receipt A
      LEFT JOIN operation B ON A.id = B.receipt_id
      WHERE A.status = 1 AND A.id = ?`;

    dbQuery(dataQuery, [receiptId], (err, result) => {
      if (err) {
        printLog(err);
        return reject(err);
      }

      if (result && result.length) {
        resolve(result[0]);
      } else {
        return reject({ msg: 'Receipt not found' });
      }
    });
  });
};

module.exports = service;
