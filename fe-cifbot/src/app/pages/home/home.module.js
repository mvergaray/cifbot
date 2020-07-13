import HomeConfig from "./home.config";
import Home from "./home.component";

/* @ngInject */
const HomeModule = angular
  .module('app.home', [])
  .config(HomeConfig)
  .component('home', Home);

export default HomeModule;