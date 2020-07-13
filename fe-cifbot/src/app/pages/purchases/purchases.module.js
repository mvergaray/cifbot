import PurchasesConfig from "./purchases.config";
import PurchasesList from "./purchasesList/purchasesList.component";
import PurchasesForm from "./purchasesForm/purchasesForm.component";
import PaymentForm from "./paymentForm/paymentForm.component";

/* @ngInject */
const PurchasesModule = angular
  .module('app.purchases', [])
  .config(PurchasesConfig)
  .component('purchasesList', PurchasesList)
  .component('purchasesForm', PurchasesForm)
  .component('paymentForm', PaymentForm);

export default PurchasesModule;