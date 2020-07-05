import HomeConfig from "./home.config";

/* @ngInject */
const HomeModule = angular
  .module('app.home', [])
  .config(HomeConfig);

export default HomeModule;