(() => {
  'use strict';

  angular.module('documentarioApp')
    .constant('_', window._)
    .constant('$', window.jQuery)
    .constant('moment', window.moment);
})();
