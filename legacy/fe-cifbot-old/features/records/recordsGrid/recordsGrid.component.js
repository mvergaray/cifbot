(() => {
  'use strict';

  angular
    .module('doc.features')
    .component('recordsGrid', {
      templateUrl: 'features/records/recordsGrid/recordsGrid.html',
      controller: RecordsGridCtrl,
      controllerAs: 'vm',
      bindings: {
        deleteRecord: '&',
        filters: '<',
        selectedRecords: '=',
        status: '<'
      }
    });

  function RecordsGridCtrl (
    $scope,
    $location,
    Folders,
    notification,
    permissionsV2,
    RecordService
  ) {
    var vm = this,
      filterModels = ['client_id', 'created_by', 'code',
      'binnacle_id', 'document', 'destination', 'sender', 'status', 'startDate', 'endDate'];

    vm.confirmDelete = _confirmDelete;
    vm.downloadReceipts = _downloadReceipts;
    vm.rowClicked = _rowClicked;
    vm.search = _search;

    vm.$onInit = () => {
      vm.tableConfig = {};
      vm.previousClickedId = {};
      vm.canEdit = !!permissionsV2.isAllowed('records', '_edit');

      _initColDef();
      _initGrid();
    };

    vm.$onDestroy = () => {
      vm.onRefreshGridEventListener();
    };

    function _confirmDelete (record) {
      vm.deleteRecord({ record: record });
    }

    function _downloadReceipts (code) {
      Folders.get({}, (response) => {
        let foldersList = _.map(_.get(response, 'results.list'), 'name');
        RecordService.getFilesName({ code: code, folders: foldersList }).then((data) => {
          if (data && data.length) {
            data.forEach(RecordService.downloadReceipt);
          } else {
            notification.warn('No se encontró ningún registro con código: ' + code);
          }
        }, () => {
          notification.warn('No se encontró ningún registro con código: ' + code);
        });
      }, () => {
        notification.error('Error al obtener listado de folders.');
      });
    }

    function _getGridParams () {
      let result = _.pick(_.merge(vm.filters, {
        client_id: vm.filters.client_id,
        status: vm.status,
        reload: false
      }), filterModels);

      /*if (vm.filters.start_date && vm.filters.start_date.isValid()) {
        result.startDate = vm.filters.start_date.unix() * 1000;
      }

      if (vm.filters.end_date && vm.filters.end_date.isValid()) {
        result.endDate = vm.filters.end_date.unix() * 1000;
      }*/

      return result;
    }

    function _initColDef () {
      vm.colDef = [
        {
          columnHeaderDisplayName: 'Código',
          template: require('../templates/codeColumn.html'),
          width: '6em'
        },
        {
          columnHeaderDisplayName: 'Fecha',
          displayProperty: 'short_date',
          sortKey: 'date',
          width: '4em'
        },
        {
          columnHeaderDisplayName: 'Nro. Doc',
          template: require('../templates/documentColumn.html'),
          width: '7em'
        },
        {
          columnHeaderDisplayName: 'Destino',
          displayProperty: 'destination',
          width: '15em'
        },
        {
          columnHeaderDisplayName: 'Dirección',
          template: require('../templates/addressColumn.html'),
          width: '15em'
        },
        {
          columnHeaderDisplayName: 'Distrito',
          displayProperty: 'district',
          width: '4em'
        },
        {
          columnHeaderDisplayName: 'Remitente',
          displayProperty: 'sender',
          width: '15em'
        },
        {
          columnHeaderDisplayName: 'Detalle',
          template: require('../templates/detailColumn.html'),
          width: '15em'
        },
        {
          columnHeaderDisplayName: '',
          template: require('../templates/editColumn.html'),
          width: '.5em'
        }
      ];

      // If user has delete permission then show delete column
      if (permissionsV2.isAllowed('records', '_delete')) {
        vm.colDef.push({
          columnHeaderDisplayName: '',
          templateUrl: 'features/common/grid/deleteColumn.html',
          width: '.5em'
        });
      }
    }

    function _initGrid () {
      vm.showGrid = true;
      vm.tableConfig = {
        url: 'records/list',
        method: 'get',
        params: _getGridParams(),
        paginationConfig: {
          response: {
            totalItems: 'count',
            itemsLocation: 'list'
          }
        },
        state: {
          sortKey: 'date',
          sortDirection: 'DEC'
        },
        rowClass: (item, index) => {
          var rowClass = '';
          if (index % 2) {
            rowClass = 'info';
          }
          return rowClass;
        }
      };
    }

    function _rowClicked (item, level) {
      var tmstp = (new Date()).getTime();

      // Prevent from opening record when clicking on checkbox
      if (level && level.target && level.target.className !== 'ad-cursor-pointer') {
        if (vm.previousClickedId.id === item.idrecord &&
            // consider a 300 miliseconds the time for a double click
            (tmstp - vm.previousClickedId.tmstp) < 300) {
          return $location.path('/document/' + item.idrecord);
        }
        vm.previousClickedId = {
          id: item.idrecord,
          tmstp: (new Date()).getTime()
        };
      }
    }

    function saveFilters () {
      let storeFilters = _.pick(vm.tableConfig.params, filterModels);

      if (vm.filters.start_date) {
        storeFilters.startDate = moment(vm.filters.start_date).unix() * 1000;
      }

      if (vm.filters.end_date) {
        storeFilters.endDate = moment(vm.filters.end_date).unix() * 1000;
      }
      
      localStorage.removeItem('se-records-filters');
      localStorage.setItem('se-records-filters', JSON.stringify(storeFilters));
    }

    function _search () {
      vm.tableConfig.params.client_id = vm.filters.client_id;
      vm.tableConfig.params.code = vm.filters.code;
      vm.tableConfig.params.binnacle_id = vm.filters.binnacle_id;
      vm.tableConfig.params.document = vm.filters.document;
      vm.tableConfig.params.destination = vm.filters.destination;
      vm.tableConfig.params.sender = vm.filters.sender;
      vm.tableConfig.params.status = vm.filters.status > 0 ?
        vm.filters.status : '';
      vm.tableConfig.params.created_by = vm.filters.created_by;

      if (vm.filters.start_date) {
        vm.filters.startDate = moment(vm.filters.start_date).unix() * 1000;
        vm.tableConfig.params.startDate = vm.filters.startDate;
      } else {
        delete vm.filters.startDate;
        delete vm.tableConfig.params.startDate;
      }

      if (vm.filters.end_date) {
        vm.filters.endDate = moment(vm.filters.end_date).unix() * 1000;
        vm.tableConfig.params.endDate = vm.filters.endDate;
      } else {
        delete vm.filters.endDate;
        delete vm.tableConfig.params.endDate;
      }

      saveFilters();
    }

    vm.onRefreshGridEventListener = $scope.$on('refreshGrid', () => {
      _search();
      vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
    });

    vm.onRefreshGridEventListener = $scope.$on('refreshGridAdnOpen', () => {
      _search();
      vm.tableConfig.params.reload = !vm.tableConfig.params.reload;
    });


  }

})();
