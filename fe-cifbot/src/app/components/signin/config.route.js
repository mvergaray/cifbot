const SigninConfigRoute = (
  $stateProvider
) => {
  $stateProvider
    .state('signin', {
      url: '/signin',
      template: '<sign-in layout-fill></sign-in>',
      title: 'Ingresar'
    })
    .state('signout', {
      url: '/signout'
    })
    .state('logout', {
      url: '/logout'
    });
};

SigninConfigRoute.$inject = ['$stateProvider'];

export default SigninConfigRoute;