const _ = require('lodash');
let companySvc = require('../services/company');
let Controller = {};

/**
 * Company Object
 *
 * id
 * name
 * ruc
 * address
 * telephone
 * status
 * is_client
 * client_type
 * is_provider
 * provider_type
 * detraction
 *
 */

let createProvider = (params) => {
  let companyprovider = {
    company_id: 1,
    provider_company_id: params.company_id,
    detraction: params.detraction,
    type: params.type
  };

  return new Promise( ( resolve, reject) => {
    dbQuery('INSERT INTO companyprovider SET ?;', companyprovider, (err, result) => {
      if (err) {
        printLog(err)
        return reject({code: 500, msg: 'Internal Server Error', dev: err});
      }

      return resolve({result: {code: '001', message: 'ok', id: result.insertId}});
    });
  });
};

let createClient = (params) => {
  let companyclient = {
    company_id: 1,
    client_company_id: params.company_id,
    type: params.type
  };

  return new Promise( ( resolve, reject) => {
    dbQuery('INSERT INTO companyclient SET ?;', companyclient, (err, result) => {
      if (err) {
        printLog(err)
        return reject({code: 500, msg: 'Internal Server Error', dev: err});
      }

      return resolve({result: {code: '001', message: 'ok', id: result.insertId}});
    });
  });
};

let createCompany = (companyBP) => {
  let company = {};

  company.name = companyBP.name;
  company.ruc = companyBP.ruc;
  company.address = companyBP.address;
  company.telephone = companyBP.telephone;

  // Set default values
  company.status = 1;
  //company.created_at = new Date();
  //company.created_by = req.user && req.user.id || -1;

  return new Promise((resolve, reject) => {
    dbQuery('INSERT INTO company SET ?;', company, function (err, result) {
      if (err) {
        printLog(err);
        reject(err);
        return;
      }

      let companyTypes = [];

      companyBP.company_id = result.insertId;

      if (companyBP.is_provider) {
        companyTypes.push(createProvider(companyBP));
      }

      if (companyBP.is_client) {
        companyTypes.push(createClient(companyBP));
      }

      return Promise.all(companyTypes)
        .then(_ => {
          resolve(result);
        }, err => {
          reject(err);
        });
    });
  });
};

Controller.getObjects = (req, res) => {
  let filter = {
    id: req.query.id,
    search: req.query.search,
    operation_type_id: req.query.operation_type_id,
    pageStart: parseInt(req.query.skip || 0, 10),
    pageCount: parseInt(req.query.limit || 0, 10),
    orderBy: undefined
  };

  companySvc.getCompanies(filter)
  .then((result) => {
    return res.status(200).json(result);
  })
  .catch((err) => {
    printLog(err);
    return res.status(500).send({code: 500, msg: 'Error fetching companies', dev: err });
  });
};

Controller.getObject = (req, res) => {
  let filter = {
    id: req.params.id,
    search: req.query.search,
    operation_type_id: req.query.operation_type_id,
    pageStart: parseInt(req.query.skip || 0, 10),
    pageCount: parseInt(req.query.limit || 0, 10),
    orderBy: undefined
  };

  companySvc.getCompanies(filter)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      printLog(err);
      return res.status(500).send({code: 500, msg: 'Error fetching companies', dev: err });
    });
};

Controller.saveObject = (req, res) => {
  var companyBP = req.body,
    company = {};

    company.name = companyBP.name;
    company.ruc = companyBP.ruc;
    company.address = companyBP.address;
    company.telephone = companyBP.telephone;

  // Set default values
  company.status = 1;
  //company.created_at = new Date();
  //company.created_by = req.user && req.user.id || -1;
  createCompany(companyBP)
    .then(result => {
      res.json({result: {code: '001', message: 'ok', id: result.insertId}});
    }, err => {
      console.log('CREATE COMPANY FAIL');
      console.log('ERROR CODE IS: ', Object.keys(err));
      if (err.errno === 1062) {
        return res.status(403).send({code: 403, msg: 'El RUC ingresado ya existe.', dev: err});
      }

      res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
    });
};

Controller.updateObject = (req, res) => {
  let id = req.params.id,
    companyBP = req.body,
    company = {};

  company.name = companyBP.receipt_id;
  company.ruc = companyBP.description;
  company.address = companyBP.address;
  company.telephone = companyBP.telephone;

  dbQuery('UPDATE company SET ? WHERE ID = ?;', [operation, id],
    function (err) {
      if (err) {
        printLog(err);
        res.status(500).send({code: 500, msg: 'Internal Server Error', dev: err});
        return;
      }

      res.json({result: {code: '001', message: 'ok'}});
    });
};

/*
Controller.saveObjects = (operation) => {
  let query = 'INSERT INTO operation SET ?;',
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
*/
module.exports = Controller;
