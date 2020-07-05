
import React from "react";
import ReactDOM from "react-dom";
import Layout from './qrcodeScanner.react';

(() => {
  angular
    .module('doc.features')
    .directive('reactDirective', function() {
      return {
          template: '<div id="reactapp" class="react-part"></div>',
          scope: {
            scanComplete:'&'
          },
          link: function(scope, element, attrs){
                scope.newItem = (value) => {alert (value)}
                scope.foundQRCode = (code) => {
                  scope.scanComplete({ code: code
                  })
                };

                scope.$on( "$destroy", unmountReactElement );

                const reactapp = document.getElementById('reactapp')
                /*scope.$watch('todos', function(newValue, oldValue) {
                    if (angular.isDefined(newValue)) {
                      ReactDOM.render(
                        <Layout todos={newValue} newItem={scope.newItem} markComplete={scope.foundQRCode}/>
                        , reactapp);
                    }
                }, true);*/
                ReactDOM.render(
                  <Layout newItem={scope.newItem} scanComplete={scope.foundQRCode}/>
                  , reactapp);

                function unmountReactElement() {
                  ReactDOM.unmountComponentAtNode( reactapp );
                }
            }
        }
    });
})();
