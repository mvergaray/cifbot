(function () {
  angular
    .module('doc.features')
    .factory('ShippingType', ['$resource', function ($resource) {
      var ShippingType = $resource('/ShippingType/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return ShippingType;
    }]);
})();
