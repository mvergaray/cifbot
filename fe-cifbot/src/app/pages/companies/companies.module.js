import { compact } from "lodash";
import CompaniesConfig from "./companies.config";
import CompaniesList from "./companiesList/companiesList.component";

/* @ngInject */
const CompaniesModule = angular
  .module('app.companies', [])
  .config(CompaniesConfig)
  .component('companiesList', CompaniesList);

export default CompaniesModule;