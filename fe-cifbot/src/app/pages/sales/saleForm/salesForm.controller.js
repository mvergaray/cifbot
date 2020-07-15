import * as _ from 'lodash';
import * as moment from 'moment';
/* @ngInject */
class SalesFormCtrl {

  constructor (
    $mdDialog,
    $state,
    $stateParams,
    moment,
    ClientsService,
    ReceiptsService,
    TransactionsService,

    ROUTES
  ) {
    this.$mdDialog = $mdDialog;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.moment = moment;
    this.ClientsService = ClientsService;
    this.ReceiptsService = ReceiptsService;
    this.TransactionsService = TransactionsService;

    // Constants
    this.ROUTES = ROUTES;

    this.sale = {};
    this.sale.tax_percentage = 18;

    this.dateFormat = 'YYYY-MM-DD';
    this.dateFormatEs = 'DD-MM-YYYY';
    this.operationTypes = [
      {id: 2, code: 5, description: 'Ventas'}
    ];

    this.listDataSource = {};
    this.paymentsList = {};
  }

  $onInit () {
    this.receiptId = this.$stateParams.receiptId;

    if (this.receiptId) {
      this.getReceipt(this.receiptId);
    }
  }

  getReceipt (receiptId) {
    this.ReceiptsService
      .getReceipt(receiptId)
      .then(receipt => {
        let services = [],
        date = this.moment(receipt.date, 'DD/MM/YYYY'),
        dueDate = this.moment(receipt.due_date, 'DD/MM/YYYY'),
        period = date.format('MM/YYYY');

      this.sale = {
        date: date,
        due_date: dueDate,
        period: period,
        operation_type_id: receipt.operation_type_id,
        assoc_company_id: receipt.assoc_company_id,
        doc_number: receipt.doc_number,
        serie: receipt.serie,
        total_amount: receipt.total_amount,
        tax_base: receipt.tax_base,
        tax_percentage: 18,
        description: receipt.description
      };

      this.listDataSource.data = receipt.seats;

      this.getTransactions(receipt.operation_id);

      if (receipt.assoc_company_id) {
        services.push(this.ClientsService.getClient(receipt.assoc_company_id));
      }

      return services;
    })
    .then(_ => {

    });
  }

  getTransactions (operationId) {
    this.TransactionsService
      .getTransactions({ operation_id: operationId })
      .then((transactions) => {
        this.paymentsList.data = _.flatMap(transactions.list, 'seats');
      });
  }

  onSubmit (form) {
    if (form && !form.$valid) {
      return;
    }

    const saveObject = {
      company_id: 1,
      operation_type_id: this.sale.operation_type_id,
      assoc_company_id: this.sale.assoc_company_id,
      doc_number: this.sale.doc_number,
      serie: this.sale.serie,
      total_amount: this.sale.total_amount,
      tax_base: this.getTaxBase(),
      tax_percentage: this.sale.tax_percentage,
      tax_value: this.mathRandom(this.sale.total_amount - this.getTaxBase()),
      description: this.sale.description,
      date: moment(this.sale.date).format(this.dateFormat),
      due_date: moment(this.sale.due_date).format(this.dateFormat),
    };

    this.ReceiptsService
      .updateReceipt(saveObject)
      .then((response) => {
        this.$state.go(this.ROUTES.SALES_EDIT, {
          receiptId: response.result.id
        });
      });
  }

  getTaxBase () {
    let taxBase = this.sale.total_amount * 100 / (100 + this.sale.tax_percentage);
    taxBase = (Math.round(taxBase * 100) / 100) || 0;
    return  taxBase;
  }

  mathRandom (number) {
    return (Math.round(number * 100) / 100) || 0;
  }

  updateTaxBase () {
    this.sale.tax_base = this.sale.total_amount * 100 / (100 + this.sale.tax_percentage);
    this.sale.tax_base = (Math.round(this.sale.tax_base * 100) / 100) || 0;
  }

  goToPayment () {
    this.$state.go(this.ROUTES.INCOME_NEW, {
      receiptId: this.receiptId
    });
  }

  getOperationDate (operation) {
    return moment(operation.created_by).format(this.dateFormatEs);
  }
}

export default SalesFormCtrl;