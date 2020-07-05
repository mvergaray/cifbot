import './_users.scss';

(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('users', {
      templateUrl: './features/users/users.html',
      controller: usersCtrl,
      controllerAs: 'vm',
      bindings: {
        config: '<',
        currentUser: '<'
      }
    });

  /* @ngInject */
  function usersCtrl (
    $location, notification, User
  ) {
    let vm = this;

    vm.$onInit = () => {
      _setHeaderConfig();

      vm.currentPath = '#' + $location.path() + '/';

      vm.searchKey = '';
      vm.toDelete = {
        id: 0,
        name: '',
        isAllowed: false
      };
      vm.colDef = [
        {
          columnHeaderDisplayName: 'Código',
          template: require('../common/templates/id.html'),
          sortKey: 'id',
          width: '6em'
        },
        {
          columnHeaderDisplayName: 'Nombres',
          displayProperty: 'name',
          sortKey: 'name',
          width: '7em'
        },
        {
          columnHeaderDisplayName: 'Apellidos',
          displayProperty: 'last_name',
          sortKey: 'last_name',
          width: '7em'
        },
        {
          columnHeaderDisplayName: 'Cod. Empleado',
          template: require('./templates/employeeIdColumn.html'),
          width: '4em'
        },
        {
          columnHeaderDisplayName: 'Usuario',
          displayProperty: 'username',
          sortKey: 'username',
          width: '7em'
        },
        {
          columnHeaderDisplayName: 'Rol',
          template: require('./templates/roleColumn.html'),
          sortKey: 'role_id'
        },
        {
          columnHeaderDisplayName: 'Área',
          displayProperty: 'area_name'
        },
        {
          columnHeaderDisplayName: 'Oficina',
          displayProperty: 'office_name'
        },
        {
          columnHeaderDisplayName: 'Cliente',
          displayProperty: 'client_name'
        },
        {
          columnHeaderDisplayName: 'Estado',
          template: require('./templates/statusColumn.html'),
          width: '4em'
        }
      ];

      // If user has edit permission then show edit column
      if (vm.currentUser.isAllowed('users', '_edit')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/editColumn.html',
          width: '1em'
        });
      }
      // If user has delete permission then show delete column
      if (vm.currentUser.isAllowed('users', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '1em'
        });
      }

      vm.tableConfig = {
        url: 'Users',
        method: 'get',
        params:{
          reload: false
        },
        paginationConfig: {
          response: {
            totalItems: 'results.count',
            itemsLocation: 'results.list'
          }
        },
        state: {
          sortKey: 'id',
          sortDirection: 'ASC'
        },
        rowClass: function (item, index) {
          var rowClass = '';
          if (index % 2) {
            rowClass = 'info';
          }
          return rowClass;
        }
      };

      vm.previousClickedId = {};
    };

    vm.rowClicked = function (item, level) {
      var tmstp = (new Date()).getTime();

      if (vm.currentUser.isAllowed('users', '_edit')) {
        // Prevent from opening record when clicking on checkbox
        if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
          if (vm.previousClickedId.id === item.id &&
              // consider a 300 miliseconds the time for a double click
              (tmstp - vm.previousClickedId.tmstp) < 300) {
            return $location.path('/usuarios/' + item.id);
          }
          vm.previousClickedId = {
            id: item.id,
            tmstp: (new Date()).getTime()
          };
        }
      }
    };

    vm.confirmDelete = function (user) {
      vm.toDelete.id = user.id;
      vm.toDelete.name = [user.name, user.last_name].join(' ');
      vm.toDelete.isAllowed = vm.currentUser.id != user.id;

      angular.element('#deleteUserModal').modal();
    };

    vm.deleteUser = function (user_id) {
      User.delete({id: user_id}, function () {
        vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
        notification.great('Usuario eliminado correctamente.');
      }, function (error) {
        var message = error.data && error.data.results && error.data.results.message ||
          'Error al eliminar usuario.';

        notification.error(message);
      });
    };

    vm.search = function () {
      vm.tableConfig.params.name = vm.searchKey;
    };

    function _setHeaderConfig () {
      vm.headerConfig = {
        title: 'Gestión de Usuarios',
        goTo: '#/usuarios/add',
        icon: 'add_box',
        actionLabel: 'Crear Usuario'
      };
    }
  }
})();