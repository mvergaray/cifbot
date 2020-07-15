import ROUTES from './routes.constant';
import StorageService from './storage.service';

const CoreModule = angular.module('app.core', []);

CoreModule
  .constant('ROUTES', ROUTES)
  .service('StorageService', StorageService);

export default CoreModule;