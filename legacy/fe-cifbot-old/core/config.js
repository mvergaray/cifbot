
(function () {
  'use strict';
  // ========== configuration module ========== //
  angular
    .module('documentarioApp')
    .config(function($mdDateLocaleProvider) {

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
    })
    .config(function($mdIconProvider) {
      $mdIconProvider
        .icon('arrow_drop_down', 'images/icons/arrow_drop_down.svg', 24)
        .icon('add_location', 'images/icons/add_location.svg', 24)
        .icon('add_photo_alternate', 'images/icons/add_photo_alternate.svg', 24)
        .icon('account_circle', 'images/icons/account_circle.svg', 24)
        .icon('add_box', 'images/icons/add_box.svg', 24)
        .icon('apartment', 'images/icons/apartment.svg', 24)
        .icon('arrow_drop_down', 'images/icons/arrow_drop_down.svg', 24)
        .icon('assignment_ind', 'images/icons/assignment_ind.svg', 24)
        .icon('assignment_returned', 'images/icons/assignment_returned.svg', 24)
        .icon('assignment_turned_in', 'images/icons/assignment_turned_in.svg', 24)
        .icon('assignment', 'images/icons/assignment.svg', 24)
        .icon('business', 'images/icons/business.svg', 24)
        .icon('calendar_today', 'images/icons/calendar_today.svg', 24)
        .icon('check_box', 'images/icons/check_box.svg', 24)
        .icon('close', 'images/icons/close.svg', 24)
        .icon('cloud_download', 'images/icons/cloud_download.svg', 24)
        .icon('cloud_upload', 'images/icons/cloud_upload.svg', 24)
        .icon('code', 'images/icons/code.svg', 24)


        .icon('delete', 'images/icons/delete.svg', 24)
        .icon('exit_to_app', 'images/icons/exit_to_app.svg', 24)
        .icon('expand_less', 'images/icons/expand_less.svg', 24)
        .icon('expand_more', 'images/icons/expand_more.svg', 24)
        .icon('file_copy', 'images/icons/file_copy.svg', 24)
        .icon('find_in_page', 'images/icons/find_in_page.svg', 24)
        .icon('fingerprint', 'images/icons/fingerprint.svg', 24)
        .icon('folder', 'images/icons/folder.svg', 24)
        .icon('home', 'images/icons/home.svg', 24)
        .icon('image', 'images/icons/image.svg', 24)
        .icon('keyboard_arrow_left', 'images/icons/keyboard_arrow_left.svg', 24)

        .icon('local_shipping', 'images/icons/local_shipping.svg', 24)
        .icon('menu', 'images/icons/menu.svg', 24)
        .icon('more_vert', 'images/icons/more_vert.svg', 24)
        .icon('note', 'images/icons/note.svg', 24)
        .icon('note_add', 'images/icons/note_add.svg', 24)
        .icon('person', 'images/icons/person.svg', 24)
        .icon('people', 'images/icons/people.svg', 24)
        .icon('picture_as_pdf', 'images/icons/picture_as_pdf.svg', 24)
        .icon('picture_in_picture_alt', 'images/icons/picture_in_picture_alt.svg', 24)
        .icon('picture_in_picture', 'images/icons/picture_in_picture.svg', 24)
        .icon('print', 'images/icons/print.svg', 24)
        .icon('qrcode', 'images/icons/qrcode.svg', 24)
        .icon('save_alt', 'images/icons/save_alt.svg', 24)
        .icon('search', 'images/icons/search.svg', 24)
        .icon('settings', 'images/icons/settings.svg', 24)
        .icon('track_changes', 'images/icons/track_changes.svg', 24)


        .defaultIconSet('images/icons/core-icons.svg', 24);
    });
})();