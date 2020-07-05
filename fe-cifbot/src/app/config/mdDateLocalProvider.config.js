const MdDateLocaleProvider = function($mdDateLocaleProvider) {

  $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  $mdDateLocaleProvider.shortDays = ['Dom', 'Lum', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul',
    'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

  $mdDateLocaleProvider.formatDate = function (date) {
    if (date) {
      let tempDate = moment(date);
      return (tempDate.isValid() ? tempDate.format('DD/MM/YYYY') : '');
    } else {
      return null;
    }
  };
};

MdDateLocaleProvider.$inject = ['$mdDateLocaleProvider'];

export default MdDateLocaleProvider;