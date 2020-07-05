import StorageService from "./storage.service";

const CoreModule = angular.module('app.core', []);

CoreModule
  .service('StorageService', StorageService);

export default CoreModule;