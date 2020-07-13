/* @ngInject */
class CompaniesListCtrl {

  constructor (
    CompaniesService
  ) {
    this.CompaniesService = CompaniesService;

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
    this.getCompanies();
  }

  getCompanies () {
    this.CompaniesService.getList({
      search: this.filterParams.search || '',
      operation_type_id: 1,
      page: this.filterParams.page || 0,
      limit: this.filterParams.limit,
      skip: this.filterParams.skip || 0,
      sort: 'id',
      sort_dir: 'asc'
    })
    .then((companies) => {
      this.companies = companies.list;
    });
  }
}

export default CompaniesListCtrl;