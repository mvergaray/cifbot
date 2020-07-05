class SideBarMenuCtrl {
  constructor (
  ) {
    this.mainMenu = [];
  }

  $onInit () {
    this.mainMenu.push({
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/inicio',
      aIcon: 'track_changes',
      label: 'Inicio',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/ventas',
      aIcon: 'track_changes',
      label: 'Comprobante de ventas',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/compras',
      aIcon: 'track_changes',
      label: 'Comprobante de compras',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/provisiones',
      aIcon: 'track_changes',
      label: 'Provisiones',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/empresas',
      aIcon: 'track_changes',
      label: 'Mantenimiento de empresas',
      isActive: true,
      subMenu: []
    },
    {
      isAllowed: true,
      liClass: 'treeview',
      aLink: '#/cuentas',
      aIcon: 'track_changes',
      label: 'Mantenimiento de cuentas contable',
      isActive: true,
      subMenu: []
    });
  }
}

SideBarMenuCtrl.$inject = ['CurrentUserService'];

export default SideBarMenuCtrl;