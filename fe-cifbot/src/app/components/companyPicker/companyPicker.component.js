import template from './companyPicker.html';
import controller from './companyPicker.controller';

/* @ngInject */
const CompanyPicker = {
  template,
  controller,
  controllerAs: 'vm',
  bindings: {
    selectedCompany: '='
  }
};

export default CompanyPicker;