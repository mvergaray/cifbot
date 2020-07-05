import AccountsConfig from "./accounts.config";

/* @ngInject */
const AccountsModule = angular
  .module('app.accounts', [])
  .config(AccountsConfig);

export default AccountsModule;