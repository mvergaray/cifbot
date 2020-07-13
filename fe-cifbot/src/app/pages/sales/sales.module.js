import SalesConfig from "./sales.config";
import SalesList from "./salesList/salesList.component";
import SalesForm from "./saleForm/salesForm.component";

/* @ngInject */
const SalesModule = angular
  .module('app.sales', [])
  .config(SalesConfig)
  .component('salesList', SalesList)
  .component('salesForm', SalesForm);

export default SalesModule;