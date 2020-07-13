/* @ngInject */
const MdThemingProviderConfig = ($mdThemingProvider) => {
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('orange');
};

export default MdThemingProviderConfig;