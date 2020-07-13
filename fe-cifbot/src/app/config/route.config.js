/* @ngInject */
const RouteConfig = function (
  $locationProvider,
  $stateProvider,
  $urlRouterProvider
) {
  $locationProvider.hashPrefix('');

  $stateProvider
    .state('app', {
      abstract: true,
      template: '<app></app>'
    })
    .state('app.rootPath', {
      url: '',
      accessMode: 'private'
    })
    .state('error', {
      url: '/error',
      template: '<div><h1>{{Opps!, something happened}}</h1></div>' //PENDING
    })
    .state('404', {
      url: '/404',
      template: '<div><h1>NOT FOUND</h1></div>'
    });

  $urlRouterProvider.otherwise('/404');
};

export default RouteConfig;