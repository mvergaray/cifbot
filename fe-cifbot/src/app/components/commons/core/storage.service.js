const StorageService = function ($window) {
  var service = this;

  service.getItemFromSessionStorage = function (key) {
    return $window.sessionStorage.getItem(key);
  };

  service.setItemInSessionStorage = function (key, value) {
    $window.sessionStorage.setItem(key, value);
  };

  service.setItemInLocalStorage = function (key, value) {
    $window.localStorage.setItem(key, value);
  };

  service.getItemFromLocalStorage = function (key) {
    return $window.localStorage.getItem(key);
  };

  service.removeFromLocalStorage = function (key) {
    $window.localStorage.removeItem(key);
  };
};

StorageService.$inject = ['$window'];

export default StorageService;