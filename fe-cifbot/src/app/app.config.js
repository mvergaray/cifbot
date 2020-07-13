/* @ngInject */
const AppConfig = function (
  $trace
) {
  $trace.enable('TRANSITION');
};

export default AppConfig;