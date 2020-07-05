(function () {
  angular
    .module('doc.features')
    .factory('DocumentTypes', ['$resource', function ($resource) {
      var DocumentTypes = $resource('/DocumentTypes/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return DocumentTypes;
    }]);
})();
