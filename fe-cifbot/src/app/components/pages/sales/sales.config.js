import SalesModule from "./sales.module";

const SalesConfig = function (
  $stateProvider
) {
  $stateProvider
    .state('app.sales', {
      url: '/ventas',
      template: 'Home'
    });
};

export default SalesConfig;