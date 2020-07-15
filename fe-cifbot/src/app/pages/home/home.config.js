/* @ngInject */
const HomeConfig = (
  $stateProvider
) => {
  $stateProvider
    .state('app.home', {
      url: '/inicio',
      template: '<home></home>',
      accessMode: 'private',
      title: 'Inicio',
    });
};

export default HomeConfig;