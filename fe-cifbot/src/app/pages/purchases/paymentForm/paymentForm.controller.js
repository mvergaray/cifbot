/* @ngInject */
class PaymentFormCtrl {

  constructor (
  ) {
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
  }

  $onInit () {

  }
}

export default PaymentFormCtrl;