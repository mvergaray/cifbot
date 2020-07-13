import AccountsConfig from "./accounts.config";
import AccountsList from "./accountsList/accountsList.component";

/* @ngInject */
const AccountsModule = angular
  .module('app.accounts', [])
  .config(AccountsConfig)
  .component('accountsList', AccountsList);

export default AccountsModule;