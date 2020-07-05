import './datepicker.scss';

angular
  .module('doc.features')
  .directive('datePicker', () => {
    return {
      restrict: 'E',
      templateUrl: 'core/datepicker/datepicker.html',
      scope: {
        tabindex:"=",
        ngModel: '=',
        title: '@'
      },
      link : function (scope, element) {
        $(function () {
          // Define spanish texts
          $(element).datepicker({
            language: 'es',
            autoclose: true,
            clearBtn: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy',
            endDate: '+0d'
          }).datepicker('update', scope.ngModel)
          .inputmask('dd/mm/yyyy', {placeholder: 'dd/mm/aaaa'});;
        });
      }
    };
  });
