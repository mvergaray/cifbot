const _ = require('lodash');
let service = {};

service.getCompanies = () => {

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
