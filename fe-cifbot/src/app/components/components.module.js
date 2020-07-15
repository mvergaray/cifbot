import angular from 'angular';
import SidebarMenu from './sidebarMenu/sidebarMenu.component';
import Toolbar from './toolbar/toolbar.component';

import CoreModule from './commons/core/core.module';
import PagesModule from '../pages/pages.module';
import SigninModule from './signin/signin.module';
import URLS from './commons/URLS.constant';
import ServicesModule from '../services/services.module';
import CompanyPicker from './companyPicker/companyPicker.component';
import Botcopy from './botcopy/botcopy.component';


const ComponentsModule = angular.module('app.components', [
  ServicesModule.name,
  CoreModule.name,
  SigninModule.name,
  PagesModule.name
]);

ComponentsModule
  .constant('URLS', URLS)

  .component('sidebarMenu', SidebarMenu)
  .component('toolbar', Toolbar)
  .component('companyPicker', CompanyPicker)
  .component('botcopy', Botcopy)
  ;

export default ComponentsModule;
