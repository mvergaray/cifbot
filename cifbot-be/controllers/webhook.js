const extend = require('util')._extend;
const _ = require('lodash');
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
  console.log('handle webhook post');
  console.log('WH Body:');
  console.log(req.body);
  console.log('WH Query:');
  console.log(req.query);
  console.log('WH Params:');
  console.log(req.params);
  let summary = {};

  receiptSvc.getSalesCount({
    startDate: '12/01/2019',
    endDate: '12/31/2019'
  })
  .then((result)=> {
    console.log('sale result');
    console.log(result);
    summary.salesList = result;

    return receiptSvc.getPurchasesCount({
      startDate: '12/01/2019',
      endDate: '12/31/2019'
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

    var resultText = `Este es el estado de cuentas de compras y ventas durante el mes de Diciembre: \n\n
    Facturas de Venta:
    # de facturas: ${results.salesCount}\n\n
    # de facturas cobradas: ${results.salesCompletedCount}\n\n
    Total de dinero emitido por las facturas: ${results.salesTotalAmount}\n\n
    Total de dinero que ingresó: ${results.incomeTotalAmount}\n\n
    Facturas e Compra:
    # de facturas: ${results.purchaseCount}\n\n
    # de facturas pagadas: ${results.purchasesCompletedCount}\n\n
    Total de dinero emitido por las facturas ${results.salesTotalAmount} \n\n
    Total de dinero que salió: S/.${results.outcomeTotalAmount}\n\n
    `;

    var agentResponse = [
      `Este es el estado de cuentas de compras y ventas durante el mes de Diciembre: `,
      `Facturas de Venta:`,
      `# de facturas: ${results.salesCount}\n\n`,
      `# de facturas cobradas: ${results.salesCompletedCount}\n\n`,
      `Total de dinero emitido por las facturas: ${results.salesTotalAmount}\n\n`,
      `Total de dinero que ingresó: ${results.incomeTotalAmount}\n\n`,
      `Facturas e Compra:`,
      `# de facturas: ${results.purchaseCount}\n\n`,
      `# de facturas pagadas: ${results.purchasesCompletedCount}\n\n`,
      `Total de dinero emitido por las facturas ${results.salesTotalAmount} \n\n`,
      `otal de dinero que salió: S/.${results.outcomeTotalAmount}\n\n`
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