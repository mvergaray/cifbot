import PurchasesConfig from "./purchases.config";
import PurchasesList from "./purchasesList/purchasesList.component";
import PurchasesForm from "./purchasesForm/purchasesForm.component";
import OutcomeForm from "./outcomeForm/outcomeForm.component";

/* @ngInject */
const PurchasesModule = angular
  .module('app.purchases', [])
  .config(PurchasesConfig)
  .component('purchasesList', PurchasesList)
  .component('purchasesForm', PurchasesForm)
  .component('outcomeForm', OutcomeForm);

export default PurchasesModule;