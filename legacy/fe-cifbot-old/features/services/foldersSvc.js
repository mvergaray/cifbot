(function () {
  angular
    .module('doc.features')
    .factory('Folders', ['$resource', function ($resource) {
      var Folders = $resource('/Folders/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return Folders;
    }]);
})();
