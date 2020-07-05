/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	// test/all.js
	
	var core = __webpack_require__(1);
	core.keys().forEach(core);
	
	var app = !(function webpackMissingModule() { var e = new Error("Cannot find module \"../features\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
	app.keys().forEach(app);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var map = {
		"./app.component.js": 2,
		"./app.module.js": 3
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	(function () {
	  'use strict';
	  // ========== initialize main module ========== //
	
	  angular.module('cifbot', ['ngMaterial', 'ngMessages', 'ngAnimate', 'ngCookies', 'ngFileSaver', 'ngFileUpload', 'ngResource', 'ngRoute', 'ngSanitize', 'adaptv.adaptStrap', 'mgcrea.ngStrap', 'cifbot.features', 'ui.select', 'ui.bootstrap']);
	  angular.module('cifbot.features', []);
	
	  angular.module('cifbot')
	  /**
	   * Decorate $resource so we can add in common functionality.
	   */
	  .config(['$provide', function ($provide) {
	    $provide.decorator('$resource', ['$delegate', 'notification', function ($delegate, notification) {
	      /**
	       * Angular tries to extend the top level default action configuration with resource verb objcts.
	       * https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js#L548
	       * Since "extend" doesn't perform a deep merge, verb object ends up overriding the configuration.
	       * In order to overcome it, we will be extending each verb with its default configuration.
	       */
	
	      var defaults = {
	        get: { method: 'GET' },
	        query: { method: 'GET' },
	        save: { method: 'POST' },
	        remove: { method: 'DELETE' },
	        delete: { method: 'DELETE' },
	        update: { method: 'PUT' }
	      },
	          decorator = function decorator(url, paramDefaults, verbs) {
	        angular.forEach(verbs, function (verb, verbName) {
	          /**
	           * Extend each verb with its default configuration
	           * If the default configuration for the verb is not defined, don't do anything
	           */
	          if (defaults[verbName] && !verb.hasOwnProperty('method')) {
	            angular.extend(verb, defaults[verbName]);
	          }
	          /**
	           * Each model and verb can specify their own error handler.
	           * Default to orca.genericErrorHandler if not specified.
	           */
	          verb.interceptor = verb.interceptor || {};
	          /**
	           * Check explicitly for undefined.
	           * This allows us to set responseError to null in a model to avoid having
	           * an assigned error handler.
	           *
	           */
	          // General error Handler, Server should return the exact message each time
	          if (verb.interceptor.responseError === undefined) {
	            verb.interceptor.responseError = function (httpRequest) {
	              if (httpRequest.data && httpRequest.data.message) {
	                notification.error(httpRequest.data.message);
	              }
	              // TODO: check this with every service call message and find an specific code for this
	              /*else if(httpRequest.data && httpRequest.data.results){
	                notification.error(httpRequest.data.results.message);
	              }*/
	            };
	          }
	        });
	
	        return $delegate(url, paramDefaults, verbs);
	      };
	
	      return decorator;
	    }]);
	  }]);
	})();

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map