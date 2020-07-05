import '../../node_modules/angular-material/angular-material.scss';

import angular from 'angular';
import * as am from 'angular-material';
import * as amsg from 'angular-messages';
import * as aan from 'angular-animate';
import * as aa from 'angular-aria';
import * as as from 'angular-sanitize';
import * as auir from '@uirouter/angularjs';
import * as are from 'angular-resource';
import * as _ from 'lodash';
import * as moment from 'moment';

import ProvideConfig from './config/provide.config';
import MdIconProviderConfig from './config/mdIconProvider.config';
import MdDateLocaleProviderConfig from './config/mdDateLocalProvider.config';

import appComponent from './app.component';
import AuthModule from '../app/components/auth/auth.module';

// ========== initialize main module ========== //
angular.module('cifbot', [
    'ui.router',
    'ngMaterial',

    'ngMessages',
    'ngAnimate',
    'ngResource',

    'ngSanitize',
    AuthModule.name,
    ComponentsModule.name
  ]);

angular.module('cifbot')
/**
 * Decorate $resource so we can add in common functionality.
 */
  .run(AppConfig)
  .config(RouteConfig)
  .config(ProvideConfig)
  .config(MdDateLocaleProviderConfig)
  .config(MdIconProviderConfig)
  .constant('_', window._)
  .component('app', appComponent)
  ;

import ComponentsModule from './components/components.module';
import RouteConfig from './config/route.config';
import AppConfig from './app.config';

