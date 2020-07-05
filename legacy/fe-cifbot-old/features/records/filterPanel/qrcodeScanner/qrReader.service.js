(() => {
  angular
    .module('doc.features')
    .factory('QRReaderService', QRReaderService);

  function QRReaderService (
    $q
  ) {

    function decode (file) {
      let defer = $q.defer();

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const data = e.target.result;

        qrcode.callback = (res) => {
          defer.resolve(res);
        };

        qrcode.decode(data);
      };
      return defer.promise;
    }

    return {
      decode: decode
    }
  }
})();
