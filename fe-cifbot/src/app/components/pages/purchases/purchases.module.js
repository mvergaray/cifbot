import PurchasesConfig from "./purchases.config";

/* @ngInject */
const PurchasesModule = angular
  .module('app.purchases', [])
  .config(PurchasesConfig);

export default PurchasesModule;