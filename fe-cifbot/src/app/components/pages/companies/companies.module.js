import { compact } from "lodash";
import CompaniesConfig from "./companies.config";

/* @ngInject */
const CompaniesModule = angular
  .module('app.companies', [])
  .config(CompaniesConfig);

export default CompaniesModule;