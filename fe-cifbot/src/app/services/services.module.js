import BackendService from "./backend.service";
import Toast from "./toast.service";
import CurrentUser from "./currentUser.service";
import ReceiptsService from "./receipts.service";
import CompaniesService from "./companies.service";
import AccountsService from "./accounts.service";
import TransactionsService from "./transactions.service";
import ClientsService from "./clients.service";
import ProvidersService from "./providers.service";

const ServicesModule = angular
  .module('app.services', [])
  .factory('BackendService', BackendService)
  .factory('ToastService', Toast)
  .factory('CompaniesService', CompaniesService)
  .factory('CurrentUserService', CurrentUser)
  .factory('ReceiptsService', ReceiptsService)
  .factory('AccountsService', AccountsService)
  .factory('TransactionsService', TransactionsService)
  .factory('ClientsService', ClientsService)
  .factory('ProvidersService', ProvidersService);

export default ServicesModule;