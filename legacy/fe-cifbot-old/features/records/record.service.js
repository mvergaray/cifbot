(function () {
  angular
    .module('doc.features')
    .factory('RecordService', ['$http', '$window', 'Upload',
      function ($http, $window, Upload) {
        // TODO: evaluate use of $resource
        var self = this,
            objectName = '/records',
            filesHost = 'http://190.40.120.254/publicAccess';
        self.readAll = function (filters) {
          return $http({
            method: 'GET',
            url: objectName + '/list',
            params: filters
          }).then(function (response) {
            return response.data;
          });
        };
        self.getFilesName = function (params) {
          return $http({
            method: 'GET',
            url: '/publicAccess/secure/getFilesName',
            params: params
          }).then(function (response) {
            return response.data;
          });
        };
        self.getCreationCodeList = function () {
          return $http({
            method: 'GET',
            url: objectName + '/creation_code_list'
          }).then(function (response) {
            return response.data;
          });
        };
        self.deleteRecords = function (creationCode) {
          return $http({
            method: 'DELETE',
            url: objectName + '/delete?creationCode=' + creationCode
          }).then(function (response) {
            return response.data;
          });
        };
        self.assignRecords = function (creationCode, user, sender_id) {
          return $http({
            method: 'PUT',
            url: objectName + '/assign',
            params: {
              creationCode: creationCode,
              client_id: user.locate_client,
              office_id: user.locate_office,
              area_id: user.locate_area,
              user_id: user.id,
              client_id: user.client_id,
              bulk_sender: !!sender_id,
              sender_id: sender_id
            }
          }).then(function (response) {
            return response.data;
          });
        };
        self.downloadReceipt = function (fileName, isManifest) {
          var url = filesHost + '/download?code=' + fileName;

          if (isManifest) {
            url += '&isManifest=true';
          }

          $window.open(url, '_blank');
        };
        self.uploadManifest = function (file, binnacle_id) {
          return Upload.upload({
            url: filesHost + 'publicAccess/uploadManifest',
            data: {
              uploadFile: file,
              binnacle_id: binnacle_id
            }
          }).then(function () {
            return binnacle_id;
          }, function (error) {
            return error && error.message ? error.message : 'Error de comunicación con el servidor';
          });
        };
        return self;
      }])
    .factory('DocumentSvc', ['$resource', function ($resource) {
      var Document = $resource('/Document/:id', {id: '@id'},
        {
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          },
          getBinnacle: {
            method: 'GET',
            url: '/Document/:id/binnacle'
          }
        });


      Document.prototype.getEnviadoPor = (item) => {
        if (item.sent_by_user_data.indexOf('{') === -1 ) return item.sent_by_user_data;
        return JSON.parse(item.sent_by_user_data).user_label;
      };

      Document.prototype.getTipoSalida = (item) => {
        switch (item.delivery_type_id) {
          case '1':
            return 'Usuario';
          case '2':
            return 'Cliente';
          case '3':
            return 'Otros';
          default:
            return '';
        }
      };


      return Document;
    }])
    .factory('AssignSvc', ['$resource', function ($resource) {
      return $resource('/Document/assign', {}, {});
    }])
    .factory('DischargeSvc', ['$resource', function ($resource) {
      return $resource('/Document/discharge', {}, {});
    }])
    .factory('CloseSvc', ['$resource', function ($resource) {
      return $resource('/Document/close', {}, {});
    }]);
})();
