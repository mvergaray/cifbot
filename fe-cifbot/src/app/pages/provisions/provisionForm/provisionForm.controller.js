import * as moment from 'moment';

/* @ngInject */
class ProvisionFormCtrl {

  constructor (
    $state,
    $stateParams,
    ReceiptsService,
    ROUTES
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.ReceiptsService = ReceiptsService;

    // Constants
    this.ROUTES = ROUTES;

    this.dateFormat = 'YYYY-MM-DD';
    this.operationTypes = [ {id: 5, code: 8, description: 'Otros'} ];

    this.receipt = {};
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

        operation_type_id: receipt.operation_type_id,
        doc_number: receipt.doc_number,

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

  onSubmit (form) {
    if (form && !form.$valid) {
      return;
    }

    const saveObject = {
      company_id: 1,
      operation_type_id: this.receipt.operation_type_id,
      doc_number: this.receipt.doc_number,
      description: this.receipt.description,
      date: moment(this.receipt.date).format(this.dateFormat),
    };

    this.ReceiptsService
      .updateReceipt(saveObject)
      .then((response) => {
        this.$state.go(this.ROUTES.SALES_EDIT, {
          receiptId: response.result.id
        });
      });
  }

}

export default ProvisionFormCtrl;