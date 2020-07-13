class SideBarMenuCtrl {
  /* @ngInject */
  constructor (
    CurrentUserService
  ) {
    this.CurrentUserService = CurrentUserService;
    this.mainMenu = [];
  }

  $onInit () {
    this.mainMenu.push({
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/inicio',
      aIcon: 'home',
      label: 'Inicio',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/ventas',
      aIcon: 'assignment',
      label: 'Comprobante de ventas',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/compras',
      aIcon: 'assignment',
      label: 'Comprobante de compras',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/provisiones',
      aIcon: 'assignment',
      label: 'Provisiones',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/empresas',
      aIcon: 'business',
      label: 'Mantenimiento de empresas',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/cuentas',
      aIcon: 'calculate',
      label: 'Mantenimiento de cuentas contable',
      isActive: true,
      subMenu: []
    });

    this.username = this.CurrentUserService.getUser();
  }
}

SideBarMenuCtrl.$inject = ['CurrentUserService'];

export default SideBarMenuCtrl;