/* @ngInject */
class CompanyPickerCtrl {

  constructor (
    _,
    CompaniesService
  ) {
    this._ = _;
    this.CompaniesService = CompaniesService;

    this.companiesList = [];
  }

  $onInit () {
    this.getCompaniesList();
    this.placeholder = 'Seleccione una empresa.';
  }

  getCompaniesList () {
    this.CompaniesService.getList()
      .then((data) => {
      this.companiesList = data.list;

      if (this.selectedCompany) {
        this.selectedItem = this._.find(this.companiesList, { id: this.selectedCompany });
      }
    });
  }

  querySearch (query) {
    var results = query ? this.companiesList.filter(this._createFilterFor(query)) : this.companiesList;
    return results;
  };

  _createFilterFor (query) {
    var lowercaseQuery = query.toLowerCase();

    return function filterFn(state) {
      return !lowercaseQuery || state.name
        .toLowerCase()
        .indexOf(lowercaseQuery) >= 0;
    };
  }

  selectedItemChange (item) {
    this.selectedCompany = item ?  item.id : undefined;
  }
}

export default CompanyPickerCtrl;
