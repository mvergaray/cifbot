/* @ngInject */
class AccountsListCtrl {

  constructor (
    AccountsService
  ) {
    this.AccountsService = AccountsService;

    this.selected = [];
    this.query = {
      order: 'name',
      limit: 5,
      page: 1
    };
    this.filterParams = {};
    this.receipts = [];
  }

  $onInit () {
    this.getAccounts();
  }

  getAccounts () {
    this.AccountsService.getList({
      search: this.filterParams.search || '',
      page: this.filterParams.page || 0,
      limit: this.filterParams.limit,
      skip: this.filterParams.skip || 0,
      sort: 'account',
      sort_dir: 'asc'
    })
    .then((companies) => {
      this.companies = companies.list;
    });
  }
}

export default AccountsListCtrl;