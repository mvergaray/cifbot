/* @ngInject */
class PurchasesFormCtrl {

  constructor (
    $mdDialog,
    $state,
    $stateParams,
    moment,
    ProvidersService,
    ReceiptsService,
    TransactionsService
  ) {
    this.$mdDialog = $mdDialog;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.moment = moment;
    this.ProvidersService = ProvidersService;
    this.ReceiptsService = ReceiptsService;
    this.TransactionsService = TransactionsService;

    this.purchase = {};
    this.operationTypes = [
      {id: 2, code: 5, description: 'Compras'}
    ];

    this.listDataSource = {};
    this.paymentsList = {};

    this.paymentState = 'app.paymentForm';
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
        operation: receipt.operation_type_id,
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
    this.$state.go(this.paymentState, {
      receiptId: this.receiptId
    });
  }

}

export default PurchasesFormCtrl;