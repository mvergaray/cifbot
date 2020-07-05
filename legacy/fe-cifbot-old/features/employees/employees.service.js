(function () {
  angular
    .module('doc.features')
    .factory('Employees', ['$resource', function ($resource) {
      var Employees = $resource('/Employees/:ide', {ide: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return Employees;
    }]);
})();
