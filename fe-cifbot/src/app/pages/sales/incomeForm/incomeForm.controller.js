import * as moment from 'moment';

/* @ngInject */
class IncomeFormCtrl {

  constructor (
    $state,
    $stateParams,
    ReceiptsService,
    TransactionsService,
    ROUTES
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.ReceiptsService = ReceiptsService;
    this.TransactionsService = TransactionsService;

    // Constants
    this.ROUTES = ROUTES;

    this.dateFormat = 'YYYY-MM-DD';
    this.transactionTypes = [ {
      id: 1,
      description: 'Efectivo'
    },
    {
      id: 2,
      description: 'Depósito en cuenta'
    },
    {
      id: 3,
      description: 'Cheque'
    }];

    this.bankAccounts = [ {
      id: 1,
      description: 'BCP'
    },
    {
      id: 2,
      description: 'Conti'
    },
    {
      id: 3,
      description: 'IBK'
    }];

    this.transaction = {};
  }

  $onInit () {
    this.receiptId = this.$stateParams.receiptId;

    if (this.receiptId) {
      this.getReceipt(this.receiptId);
    } else {
      this.getReceipt(this.receiptId);
    }
  }

  getReceipt (id) {
    this.ReceiptsService.getReceipt(id)
      .then((receipt) => {
        this.transaction.operation_id = receipt.operation_id;
      });
  }

  getTransaction (id) {
    this.TransactionsService.getTransaction(id);
  }

  onSubmit(form) {
    if (form && !form.$valid) {
      return;
    }

    const saveObject = {
      company_id: 1,
      operation_type_id: this.transaction.operation_type_id,
      bank_account_id: this.transaction.bank_account_id,
      operation_id: this.transaction.operation_id,
      number: this.transaction.number,
      transaction_type_id: this.transaction.transaction_type_id,
      description: this.transaction.description,
      amount: this.transaction.amount,
      date: moment(this.transaction.date).format(this.dateFormat),
    };

    this.TransactionsService
      .updateTransaction(saveObject)
      .then((response) => {
        this.$state.go(this.ROUTES.SALES_EDIT, {
          receiptId: this.receiptId
        });
      });
  }

}

export default IncomeFormCtrl;