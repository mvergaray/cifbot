const AppConfig = function (
  $trace
) {
  $trace.enable('TRANSITION');
};

AppConfig.$inject = [
  '$trace'
];

export default AppConfig;