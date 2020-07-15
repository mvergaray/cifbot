import * as moment from 'moment';
/* @ngInject */
class PurchasesFormCtrl {

  constructor (
    $mdDialog,
    $state,
    $stateParams,
    moment,
    ProvidersService,
    ReceiptsService,
    TransactionsService,

    ROUTES
  ) {
    this.$mdDialog = $mdDialog;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.moment = moment;
    this.ProvidersService = ProvidersService;
    this.ReceiptsService = ReceiptsService;
    this.TransactionsService = TransactionsService;

    // Constants
    this.ROUTES = ROUTES;

    this.purchase = {};
    this.purchase.tax_percentage = 18;

    this.operationTypes = [
      {id: 1, code: 4, description: 'Compras'}
    ];

    this.dateFormat = 'YYYY-MM-DD';
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

      this.purchase = {
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
        services.push(this.ProvidersService.getProvider(receipt.assoc_company_id));
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

  goToPayment () {
    this.$state.go(this.ROUTES.OUTCOME_NEW, {
      receiptId: this.receiptId
    });
  }

  getTaxBase () {
    let taxBase = this.purchase.total_amount * 100 / (100 + this.purchase.tax_percentage);
    taxBase = (Math.round(taxBase * 100) / 100) || 0;
    return  taxBase;
  }

  mathRandom (number) {
    return (Math.round(number * 100) / 100) || 0;
  }

  updateTaxBase () {
    this.purchase.tax_base = this.purchase.total_amount * 100 / (100 + this.purchase.tax_percentage);
    this.purchase.tax_base = (Math.round(this.purchase.tax_base * 100) / 100) || 0;
  }

  onSubmit (form) {
    if (form && !form.$valid) {
      return;
    }

    const saveObject = {
      company_id: 1,
      operation_type_id: this.purchase.operation_type_id,
      assoc_company_id: this.purchase.assoc_company_id,
      doc_number: this.purchase.doc_number,
      serie: this.purchase.serie,
      total_amount: this.purchase.total_amount,
      tax_base: this.getTaxBase(),
      tax_percentage: this.purchase.tax_percentage,
      tax_value: this.mathRandom(this.purchase.total_amount - this.getTaxBase()),
      description: this.purchase.description,
      date: moment(this.purchase.date).format(this.dateFormat),
      due_date: moment(this.purchase.due_date).format(this.dateFormat),
    };

    this.ReceiptsService
      .updateReceipt(saveObject)
      .then((response) => {
        this.$state.go(this.ROUTES.PURCHASES_EDIT, {
          receiptId: response.result.id
        });
      });
  }

  getOperationDate (operation) {
    return moment(operation.created_by).format(this.dateFormatEs);
  }

}

export default PurchasesFormCtrl;