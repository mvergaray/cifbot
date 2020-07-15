class SideBarMenuCtrl {
  /* @ngInject */
  constructor (
    CurrentUserService,
    Session
  ) {
    this.CurrentUserService = CurrentUserService;
    this.Session = Session;

    this.mainMenu = [];
  }

  $onInit () {
    this.user = this.Session.getUserLogged();
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

export default SideBarMenuCtrl;