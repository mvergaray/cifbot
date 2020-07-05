(function () {
  angular
  .module('doc.features')
  .directive('userPanel', function () {
    return {
      restrict: 'E',
      template: require('./templates/userPanel.html'),
      controller: ['$scope', 'CurrentUser', function ($scope, CurrentUser) {
        CurrentUser.get(function (data) {
          $scope.currentUser = data;
        });
      }]
    };
  })
  .directive('requiredField', [function () {
    return {
      priority: 1, // Low priority so that it applies after any other directives than may affect the content.
      link: function (scope, element, attrs) {
        // Check if the field is required
        attrs.$observe('requiredField', function () {
          if (!attrs.requiredField || scope.$eval(attrs.requiredField)) {
            if (element.find('span.required-field-marker').length == 0) {
              element.addClass('required-field');
              element.append('<span class="required-field-marker">*</span>');
            }
          } else {
            if (element.find('span.required-field-marker').length > 0) {
              element.removeClass('required-field');
              element.find('span.required-field-marker').remove();
            }
          }
        });
      }
    };
  }])
  .directive('capitalize', [function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var capitalize = function (inputValue) {
          var capitalized;

          if (inputValue == undefined) {
            inputValue = '';
          }
          capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        };

        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  }])
  .directive('autoFocus', [function () {
    return {
      link: function (scope, element, attrs) {
        angular.noop(scope);
        attrs.$observe('autoFocus', function (newValue) {
          if (newValue == 'false') {
            element[0].blur();
          } else {
            element[0].focus();
          }
        });
      },
      restrict: 'A'
    };
  }])
  .directive('enterPress', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.enterPress);
          });

          event.preventDefault();
        }
      });
    };
  })
  .directive('customValidation', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          var transformedInput = inputValue.toLowerCase().replace(/ /g, '');

          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  })
  .directive('imSelectSearch', function () {
    return {
      restrict: 'E',
      templateUrl: 'core/templates/imSelectSearch.html',
      scope: {
        localData: '=',
        onItemClick: '&',
        initialLabel: '@',
        displayProperty: '@'

      },
      controller: ['$scope', function ($scope) {

        var vm = $scope;
        vm.displayedOptions = vm.localData;

        vm.selectedOption = vm.initialLabel || 'Seleccione';
        vm.isWidgetDisplayed = false;

        vm.showWidget = () => {
          vm.isWidgetDisplayed = true;
          vm.displayedOptions = vm.localData;
        };

        vm.hideWidget = function () {
          vm.isWidgetDisplayed = false;
          vm.displayedOptions = vm.localData;
        };

        vm.selectItem = function (item) {
          vm.selectedOption = item[vm.displayProperty];
          vm.isWidgetDisplayed = false;
          vm.onItemClick({item: item});
        };

        vm.filterOptions = () => {
          vm.displayedOptions = vm.localData.filter((item)=> {
            return item[vm.displayProperty].toLowerCase()
              .indexOf(vm.searchText.toLowerCase()) > -1 ? true : false;
          });
        };
      }]
    };
  })
  .directive('multiTag', function () {
    return {
      restrict: 'E',
      templateUrl: 'core/templates/multiTag.html',
      scope: {
        selection: '=',
        placeholder: '@'
      },
      controller: ['$scope', function ($scope) {
        $scope.data = [];
        $scope.selection = $scope.selection || [];
        $scope.getTags = function (search) {
          var newTags = [];

          if (search) {
            newTags.push(search);
          }
          return newTags;
        };

        $scope.clearSelection = function (multiSelected) {
          $scope.selection.push(multiSelected.search);
          multiSelected.search = '';
        };

        $scope.removeTag = function (removed) {
          var index = $scope.selection.indexOf(removed);

          if ($scope.selection && index > -1) {
            $scope.selection.splice(index, 1);
          }
        };
      }]
    };
  })
  .directive('focus', function () {
    return {
      restrict: 'A',
      link: function ($scope, elem, attrs) {

        elem.bind('keydown', function (e) {
          var code = e.keyCode || e.which,
              nextTabIndex;
          if (code === 13) {
            if (attrs.tabindex != undefined) {
              nextTabIndex = parseInt(attrs.tabindex, 10) + 1;
              $('[data-tabindex=' + nextTabIndex + ']').focus();
            }
          }
        });
      }
    };
  })
  .directive('onlyNumbers', () => {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: (scope, element, attrs, modelCtrl) => {
        modelCtrl.$parsers.push((inputValue) => {
          var transformedInput;
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) {
            return '';
          }

          transformedInput = inputValue.replace(/[^0-9]/g, '');
          if (transformedInput!=inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  })
  .directive('recordsPanel',
  /*@ngInject*/
  ($timeout) => {
    return {
      restrict: 'A',
      link: () => {
      $timeout(function () {
        let panelHeight = $('body').height() - 90,
            waitForElement = (selector, callback) => {
              if ($(selector).length) {
                callback($(selector));
              } else {
                setTimeout(() => {
                  waitForElement(selector, callback);
                }, 100);
              }
            };

        // Set panel height
        $('.records-panel').height(panelHeight);

        // Wait for table to display before setting height
        waitForElement('.ad-table-container', (el) => {
          el.height(panelHeight - 45);
        });
      }, 500)

      }
    };
  });
})();
