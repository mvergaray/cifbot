/* @ngInject */
const HomeConfig = (
  $stateProvider
) => {
  $stateProvider
    .state('app.home', {
      url: '/inicio',
      template: '<home></home>',
      accessMode: 'private',
      data: {
        pageTitle: 'Inicio'
      }
    });
};

export default HomeConfig;