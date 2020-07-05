import angular from 'angular';
import SidebarMenu from './sidebarMenu/sidebarMenu.component';
import Toolbar from './toolbar/toolbar.component';

import Toast from '../services/toast.service';
import BackendService from '../services/backend.service'
import CurrentUser from '../services/currentUser.service';
import CoreModule from './commons/core/core.module';
import PagesModule from './pages/pages.module';
import SigninModule from './signin/signin.module';
import URLS from './commons/URLS.constant';


const ComponentsModule = angular.module('app.components', [
  CoreModule.name,
  SigninModule.name,
  PagesModule.name
]);

ComponentsModule
  .constant('URLS', URLS)
  .factory('BackendService', BackendService)
  .factory('ToastService', Toast)
  .factory('CurrentUserService', CurrentUser)

  .component('sidebarMenu', SidebarMenu)
  .component('toolbar', Toolbar)
  ;

export default ComponentsModule;
