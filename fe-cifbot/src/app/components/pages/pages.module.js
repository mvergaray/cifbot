import HomeModule from "./home/home.module";
import AccountsModule from "./accounts/accounts.module";
import CompaniesModule from "./companies/companies.module";
import ProvisionsModule from "./provisions/provisions.module";
import PurchasesModule from "./purchases/purchases.module";
import ReportingModule from "./reporting/reporting.module";
import SalesModule from "./sales/sales.module";

/* @ngInject */
const PagesModule = angular
  .module('app.pages', [
    HomeModule.name,
    AccountsModule.name,
    CompaniesModule.name,
    ProvisionsModule.name,
    PurchasesModule.name,
    ReportingModule.name,
    SalesModule.name
  ]);

export default PagesModule;