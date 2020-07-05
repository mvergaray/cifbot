(function () {
  'use strict';

  angular
    .module('doc.features')
    .factory('AttachmentsSvc', AttachmentsSvc);

  /* @ngInject */
  function AttachmentsSvc (
    $resource
  ) {
    let Attachments = $resource('/Document/:id/attachments', {id: '@id'}, {});

    return Attachments;
  }
})();