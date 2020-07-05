import './_sidebar.scss';
(function () {
  angular
    .module('doc.features')
    .component('sidebarMenu', {
      templateUrl: './core/navigation/sidebar/sidebar.html',
      controller: SidebarCtrl,
      controllerAs: 'vm',
      bindings: {}
    });

  function SidebarCtrl (
    $location,
    $mdSidenav,
    permissionsV2
  ) {
    var vm = this,
        currentPath = '#' + $location.path();

    // In directives permissionsV2 is a promise
    // Sidebar is the first directive loaded
    // after calling by first time, the result is store for next ctrls or directives
    permissionsV2.$promise.then(function (data) {
      vm.username = `${data.name} ${data.last_name}`;
      vm.mainMenu = [];

      if (_isUserDelivery()) {
        vm.mainMenu.push({
          isAllowed: true,
          liClass: 'treeview',
          aLink: '#/seguimiento',
          aIcon: 'track_changes',
          aText: 'Seguimiento',
          isActive: true,
          subMenu: []
        });
      } else {
        vm.mainMenu.push({
          isAllowed: vm.currentUser.isAllowed('records', '_view'),
          liClass: 'treeview',
          aLink: '#/',
          aIcon: 'assignment',
          aText: 'Registros',
          isActive: true,
          subMenu: []
        });
      }

      vm.mainMenu.push(
        {
          isAllowed: vm.currentUser.isAllowed('internal_clients', '_view') ||
            vm.currentUser.isAllowed('clients', '_view')||
            vm.currentUser.isAllowed('offices', '_view')||
            vm.currentUser.isAllowed('areas', '_view')||
            vm.currentUser.isAllowed('document_type', '_view')||
            vm.currentUser.isAllowed('shipping_type', '_view')||
            vm.currentUser.isAllowed('zones', '_view')||
            vm.currentUser.isAllowed('employees', '_view')||
            vm.currentUser.isAllowed('users', '_view'),
          liClass: 'treeview',
          aLink: '',
          aIcon: 'expand_more',
          aText: 'Sistema',
          isActive: false,
          subMenu: [
            {
              isAllowed: vm.currentUser.isAllowed('internal_clients', '_view'),
              liClass: '',
              aLink: '#/clientes-internos',
              aIcon: 'business',
              aText: 'Clientes Internos'
            },
            {
              isAllowed: vm.currentUser.isAllowed('clients', '_view'),
              liClass: '',
              aLink: '#/clientes',
              aIcon: 'apartment',
              aText: 'Clientes'
            },
            {
              isAllowed: vm.currentUser.isAllowed('offices', '_view'),
              liClass: '',
              aLink: '#/oficinas',
              aIcon: 'apartment',
              aText: 'Oficinas'
            },
            {
              isAllowed: vm.currentUser.isAllowed('areas', '_view'),
              liClass: '',
              aLink: '#/areas',
              aIcon: 'apartment',
              aText: 'Áreas'
            },
            {
              isAllowed: vm.currentUser.isAllowed('document_type', '_view'),
              liClass: '',
              aLink: '#/tipo-documentos',
              aIcon: 'note',
              aText: 'Tipo de Documentos'
            },
            {
              isAllowed: vm.currentUser.isAllowed('shipping_type', '_view'),
              liClass: '',
              aLink: '#/tipo-envios',
              aIcon: 'local_shipping',
              aText: 'Tipo de Envío'
            },
            {
              isAllowed: vm.currentUser.isAllowed('zones', '_view'),
              liClass: '',
              aLink: '#/zonas',
              aIcon: 'add_location',
              aText: 'Ubicación Geográfica'
            },
            {
              isAllowed: vm.currentUser.isAllowed('employees', '_view'),
              liClass: '',
              aLink: '#/empleados',
              aIcon: 'people',
              aText: 'Empleados'
            },
            {
              isAllowed: vm.currentUser.isAllowed('users', '_view'),
              liClass: '',
              aLink: '#/usuarios',
              aIcon: 'account_circle',
              aText: 'Usuarios'
            }
          ]
        },
        {
          isAllowed: vm.currentUser.role_id == 2 && vm.currentUser.isAllowed('records', '_create'),
          liClass: 'treeview',
          aLink: '',
          aIcon: 'expand_more',
          aText: 'Carga de plantillas',
          isActive: false,
          subMenu: [
            {
              isAllowed: true,
              liClass: '',
              aLink: '#/upload',
              aIcon: 'cloud_upload',
              aText: 'Cargar'
            },
            {
              isAllowed: true,
              liClass: '',
              aLink: '#/bulkUpdate',
              aIcon: 'assignment_ind',
              aText: 'Asignar carga'
            },
            {
              isAllowed: true,
              liClass: '',
              aLink: '#/bulkDelete',
              aIcon: 'delete',
              aText: 'Eliminar carga'
            },
            {
              isAllowed: true,
              liClass: '',
              aLink: '#/folders',
              aIcon: 'folder',
              aText: 'Ubicación de cargos'
            }
          ]
        });

      // Select current path
      vm.mainMenu.some((menu) => {
        var isRouteActive = menu.subMenu.some((item) => {
          if (item.aLink == currentPath) {
            item.isActive = true;
            return true;
          }
        });
        if (isRouteActive) {
          menu.isActive = true;
          return true;
        }
      });
    });

    vm.toggleLeft = buildToggler('left');
    vm.toggleSubmenu = toggleSubmenu;
    vm.showTrackingLink = _showTrackingLink;

    vm.$onInit = () => {
      vm.currentUser = permissionsV2;
    };

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    function toggleSubmenu (menu) {
      if (menu && menu.subMenu.length) {
        menu.hideSubmenu = !menu.hideSubmenu;
      } else {
        buildToggler('left')();
      }
    }

    function _showTrackingLink () {
      return vm.currentUser.role_id == 4 || vm.currentUser.id === 1;
    }

    function _isUserDelivery () {
      return vm.currentUser.role_id == 4;
    }
  }
})();
