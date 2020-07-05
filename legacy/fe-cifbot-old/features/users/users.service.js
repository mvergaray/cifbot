(function () {
  angular
    .module('doc.features')
    .factory('User', ['$resource', function ($resource) {
      var User = $resource('/Users/:id', {id: '@id'},
        {
          get: {
            transformResponse: function (data) {
              var jsonData = angular.fromJson(data);
              // the endpoint returns 1, but ng-model requires true
              if (jsonData.clients && jsonData.clients.length) {
                jsonData.clients.forEach(function (item) {
                  item.selected = item.selected === 1 ? true : null;
                });
              }

              if(jsonData.role_id) {
                jsonData.role_id = jsonData.role_id.toString();
              }

              return jsonData;
            }
          },
          query: {
            isArray: false
          },
          update: {
            method: 'PUT'
          },
          updatePassword: {
            url: '/Users/:id/password',
            method: 'PUT'
          },
          shortlist: {
            url: '/Users/list/short',
            method: 'GET'
          }
        });

      return User;
    }])
    .factory('Profile', ['$resource', function ($resource) {
      var Profile = $resource('/Users/profile/', {},
        {
          updatePassword: {
            url: '/Users/profile/password',
            method: 'PUT'
          }
        });

      return Profile;
    }]);
})();
