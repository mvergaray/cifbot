const extend = require('util')._extend;
const _ = require('lodash');
const moment = require('moment');
const receiptSvc = require('../services/receipt');
let Controller = {};

Controller.handleWebhook = (req, res) => {
  console.log('handle webhook');
  console.log('WH Body:');
  console.log(req.body);
  console.log('WH Query:');
  console.log(req.query);
  console.log('WH Params:');
  console.log(req.params);




  return res.status(200).send('handleWebhook - GET');
};

Controller.handleWebhookPost = (req, res) => {
  let period = _.get(req, 'query.period') || {},
    startDate = moment(period.startDate),
    endDate = moment(period.endDate),
    periodLabel = 'indicadas';
  console.log('handle webhook post');
  console.log('WH Body:');
  console.log(req.body);
  console.log('WH Query:');
  console.log(req.query);
  console.log('WH Params:');
  console.log(req.params);
  let summary = {};

  if (startDate.isValid() && endDate.isValid()){
    periodLabel = startDate.format('DD/MM/YYYY') + ' y ' + endDate.format('DD/MM/YYYY');
  }

  if (!startDate.isValid()) {
    startDate = '12/01/2019';
  } else {
    startDate = startDate.format('YYYY-MM-DD');
  }

  if (!endDate.isValid()) {
    endDate = '12/31/2019';
  } else {
    endDate = endDate.format('YYYY-MM-DD');
  }




  receiptSvc.getSalesCount({
    startDate: startDate,
    endDate: endDate
  })
  .then((result)=> {
    console.log('sale result');
    console.log(result);
    summary.salesList = result;

    return receiptSvc.getPurchasesCount({
      startDate: startDate,
      endDate: endDate
    });
  })
  .then((result) => {
    console.log('purchase result');
    console.log(result);

    summary.purchasesList = result;
  })
  .then(()=> {
    var results = {};

    if (!_.isEmpty(summary.salesList)) {
      results.salesCount = _.size(summary.salesList);
      results.salesTotalAmount = _.sumBy(summary.salesList, 'receipt_amount_value');
      results.incomeTotalAmount = _.sumBy(summary.salesList, 'receipt_paid_amount_value');

      results.salesCompletedCount = _.size(_.filter(summary.salesList, (receipt) => {
        return receipt.receipt_amount_value - receipt.receipt_paid_amount_value < 1;
      }));
    }

    if (!_.isEmpty(summary.purchasesList)) {
      results.purchaseCount = _.size(summary.purchasesList);
      results.purchaseTotalAmount = _.sumBy(summary.purchasesList, 'receipt_amount_value');
      results.outcomeTotalAmount = _.sumBy(summary.purchasesList, 'receipt_paid_amount_value');
      results.purchasesCompletedCount = _.size(_.filter(summary.purchasesList, (receipt) => {
        return receipt.receipt_amount_value - receipt.receipt_paid_amount_value < 1;
      }));
    }

    var resultText = `Este es el estado de cuentas de compras y ventas durante las fechas ${periodLabel}: \n\n
    Facturas de Venta:
    # de facturas: ${results.salesCount || 0}\n\n
    # de facturas cobradas: ${results.salesCompletedCount || 0}\n\n
    Total de dinero emitido por las facturas: ${results.salesTotalAmount || 0}\n\n
    Total de dinero que ingresó: ${results.incomeTotalAmount || 0}\n\n
    Facturas e Compra:
    # de facturas: ${results.purchaseCount || 0}\n\n
    # de facturas pagadas: ${results.purchasesCompletedCount || 0}\n\n
    Total de dinero emitido por las facturas S/.${results.purchaseTotalAmount || 0} \n\n
    Total de dinero que salió: S/.${results.outcomeTotalAmount || 0}\n\n
    `;

    var agentResponse = [
      `Este es el estado de cuentas de compras y ventas durante las fechas ${periodLabel} `,
      `Facturas de Venta:`,
      `# de facturas: ${results.salesCount || 0}\n\n`,
      `# de facturas cobradas: ${results.salesCompletedCount || 0}\n\n`,
      `Total de dinero emitido por las facturas: S/ ${results.salesTotalAmount || 0}\n\n`,
      `Total de dinero que ingresó: S/ ${results.incomeTotalAmount || 0}\n\n`,
      `Facturas e Compra:`,
      `# de facturas: ${results.purchaseCount || 0}\n\n`,
      `# de facturas pagadas: ${results.purchasesCompletedCount || 0}\n\n`,
      `Total de dinero emitido por las facturas S/ ${results.purchaseTotalAmount || 0} \n\n`,
      `Total de dinero que salió: S/ ${results.outcomeTotalAmount || 0}\n\n`
    ];

    return res.status(200).send({
      result: resultText,
      agentResponse: agentResponse
    });
  })
  .catch((err)=> {
    console.log(err);
    return res.status(500).send({msg:'Hubo un error al consultar'});
  });
};


Controller.getCalendar = (req, res) => {
  let period = _.get(req, 'query.due_period') || {},
    startDate = moment(period.startDate),
    endDate = moment(period.endDate),
    periodLabel = 'indicadas';

  console.log('handle webhook post');
  console.log('WH Body:');
  console.log(req.body);
  console.log('WH Query:');
  console.log(req.query);
  console.log('WH Params:');
  console.log(req.params);
  let summary = {};

  if (startDate.isValid() && endDate.isValid()){
    periodLabel = startDate.format('DD/MM/YYYY') + ' y ' + endDate.format('DD/MM/YYYY');
  }

  if (!startDate.isValid()) {
    startDate = '2019-12-01';
  } else {
    startDate = startDate.format('YYYY-MM-DD');
  }

  if (!endDate.isValid()) {
    endDate = '2019-31-12';
  } else {
    endDate = endDate.format('YYYY-MM-DD');
  }

  receiptSvc.getSalesCount({
    dueStartDate: startDate,
    dueEndDate: endDate
  })
  .then((result)=> {
    console.log('sale result');
    console.log(result);
    summary.salesList = result;

    return receiptSvc.getPurchasesCount({
      dueStartDate: startDate,
      dueEndDate: endDate
    });
  })
  .then((result) => {
    console.log('purchase result');
    console.log(result);

    summary.purchasesList = result;
  })
  .then(()=> {
    var results = {};

    if (!_.isEmpty(summary.salesList)) {
      results.salesCount = _.size(summary.salesList);
      results.salesTotalAmount = _.sumBy(summary.salesList, 'receipt_amount_value');
      results.incomeTotalAmount = _.sumBy(summary.salesList, 'receipt_paid_amount_value');

      results.salesUncompleted = _.filter(summary.salesList, (receipt) => {
        return receipt.receipt_amount_value - receipt.receipt_paid_amount_value >= 1;
      });
    }

    if (!_.isEmpty(summary.purchasesList)) {
      results.purchaseCount = _.size(summary.purchasesList);
      results.purchaseTotalAmount = _.sumBy(summary.purchasesList, 'receipt_amount_value');
      results.outcomeTotalAmount = _.sumBy(summary.purchasesList, 'receipt_paid_amount_value');
      results.purchasesUncompleted = _.filter(summary.purchasesList, (receipt) => {
        return receipt.receipt_amount_value - receipt.receipt_paid_amount_value >= 1;
      });
    }

    var resultText;

    if (_.isEmpty(results.purchasesUncompleted)) {
      resultText = `La empresa no tiene ninguna cuenta pendiente por pagar entre las fechas ${periodLabel}.`;
    } else {
      resultText = `Las siguientes son las fechas de pago límite para el periodo de consulta: \n\n
    ${_.map(results.purchasesUncompleted, (purchase) => {
      return `Fecha: ${moment(purchase.due_date).format('DD/MM/YYYY')}. Monto: S/. ${purchase.receipt_amount_value - purchase.receipt_paid_amount_value}.`;
    })}
    `;
  }

    var agentResponse = [
      `Este es el estado de cuentas de compras y ventas durante las fechas ${periodLabel}: `,
      `Facturas de Venta:`,
      `# de facturas: ${results.salesCount || 0}\n\n`,
      `# de facturas cobradas: ${results.salesCompletedCount || 0}\n\n`,
      `Total de dinero emitido por las facturas: S/ ${results.salesTotalAmount || 0}\n\n`,
      `Total de dinero que ingresó: S/ ${results.incomeTotalAmount || 0}\n\n`,
      `Facturas e Compra:`,
      `# de facturas: ${results.purchaseCount || 0}\n\n`,
      `# de facturas pagadas: ${results.purchasesCompletedCount || 0}\n\n`,
      `Total de dinero emitido por las facturas S/ ${results.purchaseTotalAmount || 0} \n\n`,
      `Total de dinero que salió: S/ ${results.outcomeTotalAmount || 0}\n\n`
    ];

    return res.status(200).send({
      result: resultText,
      agentResponse: agentResponse
    });
  })
  .catch((err)=> {
    console.log(err);
    return res.status(500).send({msg:'Hubo un error al consultar'});
  });
};

module.exports = Controller;