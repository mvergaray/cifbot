(function () {
  angular
    .module('doc.features')
    .factory('Ubigeo', ['$resource', function ($resource) {
      var Ubigeo = $resource('/Ubigeo', {},
        {

          query: {
            isArray: false,

            transformResponse: function (data) {
              var castData = [],
                  dataJSON = JSON.parse(data);

              dataJSON.results.list.forEach(function (item) {
                // Allow to use Ubigeo Prototype in each item
                //@todo create this procces as decorator
                castData.push(new Ubigeo(item));
              });

              dataJSON.results.list = castData;
              return dataJSON;
            }
          }
        });

      Object.defineProperty(Ubigeo.prototype, 'isReadOnly', {
        get: function () {
          return this.readonly === '1';
        }
      });

      return Ubigeo;
    }])
    .factory('Zone', ['$resource', function ($resource) {
      var Zone = $resource('/Zones/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          },
          CreateDepartamento: {
            method: 'POST',
            url: '/Zones/Departamento'
          },
          UpdateDepartamento: {
            method: 'POST',
            url: '/Zones/Departamento/:id',
            params: {id: '@id'}
          }
        });

      Object.defineProperty(Zone.prototype, 'isReadOnly', {
        get: function () {
          return this.readonly === '1';
        }
      });

      return Zone;
    }])
    .factory('ZoneDepartamento', ['$resource', function ($resource) {
      var Zone = $resource('/Zones/Departamento/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {}
        });

      return Zone;
    }])
    .factory('ZoneDistrito', ['$resource', function ($resource) {
      var Zone = $resource('/Zones/Distrito/:id',
        {
          id: '@id'
        },
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return Zone;
    }])
    .factory('ZoneProvincia', ['$resource', function ($resource) {
      var Zone = $resource('/Zones/Provincia/:id',
        {
          id: '@id'
        },
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          }
        });

      return Zone;
    }]);
})();
