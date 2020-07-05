/* @ngInject */
const HomeConfig = (
  $stateProvider
) => {
  $stateProvider
    .state('app.home', {
      url: '/inicio',
      template: 'Home',
      accessMode: 'private',
      data: {
        pageTitle: 'Inicio'
      }
    });
};

export default HomeConfig;