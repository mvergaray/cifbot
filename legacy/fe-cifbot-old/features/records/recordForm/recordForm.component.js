import './record.scss';

(() => {
  'use strict';

  angular.module('doc.features')
    .controller('RecordCtrl', [
      '$scope',
      '$location',
      '$q',
      '$routeParams',
      '$window',
      'DocumentSvc',
      'DocumentTypes',
      'Folders',
      'InternalClients',
      'RecordService',
      'ReportService',
      'User',
      'notification',
      ($scope, $location, $q, $routeParams, $window, DocumentSvc, DocumentTypes,
          Folders, InternalClients, Records, ReportService, User, notification) => {
        var vm = $scope,

            id = $routeParams.id || 0,
            isBinnacleLoaded = false,
            clearData = (clientCreated) => {
              vm.document.id = null;
              vm.document.document = null;
              vm.document.reference = null;
              vm.document.multipleRecords = [{
                document: '',
                reference: ''
              }];
              vm.document.dt_others_para = null;
              vm.document.dt_others_address = null;
              vm.document.dt_others_ubigeo = '';
              vm.document.createInternalClient = false;
              vm.resetData = !vm.resetData;

              if (clientCreated) {
                vm.document.dt_others_para = undefined;
                vm.document.dt_others_address = undefined;
                vm.document.dt_others_ubigeo = undefined;
              }
            },
            successHandler = (stay, clientCreated) => {
              vm.isSaveDisabled = false;
              notification.great('Registro guardado correctamente.');
              if (stay) {
                // Clear data to create another record
                clearData(clientCreated);
              } else {
                vm.backToList();
              }
            },
            errorHandler = (err) => {
              vm.isSaveDisabled = false;
              notification.error(err.data.message);
            },
            preValidation = () => {
              var result = true;

              if (vm.document.delivery_type_id == '3' &&
                  !vm.document.dt_others_ubigeo) {
                notification.warn('Debe seleccionar la ubicación de destino.');
                return false;
              }

              if (vm.document.weight) {
                if (isNaN(+vm.document.weight)) {
                  notification.warn('El peso debe ser un número.');
                  return false;
                }
              }

              return result;
            },
            castDocumentToEdit = () => {
              switch (vm.document.delivery_type_id) {
                case '1':
                  vm.deliveryUserConfig.initialValue = vm.document.dt_user_id;
                  break;
                case '2':
                  vm.deliveryClientConfig.initialValue = vm.document.dt_client_id;
                  break;
                case '3':
                  vm.document.dt_others_para = vm.document.destination;
                  vm.document.dt_others_address = vm.document.address;
                  vm.document.dt_others_ubigeo = vm.document.ubigeo_id;
                  break;
              }

              vm.document.sender = {};
            },
            getBinnacleData = () => {
              vm.isBinnacleLoading = true;
              DocumentSvc.getBinnacle({id: id}, (result) => {
                // Load Binnacle data
                vm.document.binnacle = result.data;
                vm.isBinnacleLoading = false;
                isBinnacleLoaded = true;
              }, () => {
                notification.error('Error al obtener la bitácora.');
                vm.isBinnacleLoading = false;
              });
            },
            loadDocument = () => {
              var afterCast = () => {
                vm.pageIsLoading = false;
                vm.documentTypes = DocumentTypes.query();
              };

              if (id > 0) {
                DocumentSvc.get({id: id}, (doc) => {
                  // Load Database data
                  vm.document = doc;
                  vm.document.deliveryUser = {};
                  vm.document.deliveryClient = {};

                  // Load sender information
                  vm.senderConfig.initialValue = vm.document.sender_id;

                  castDocumentToEdit();
                  afterCast();
                });
              } else {
                afterCast();
              }
            };

        vm.pageIsLoading = true; // allow to end main requests
        vm.isBinnacleLoading = false;
        // Default Data
        vm.document = {
          createInternalClient: false,
          delivery_type_id: '1', // 1 Usuario, 2 clientes , 3 otros
          weight: 1
        };
        vm.tempDocument = {};

        vm.document.sender = {};
        vm.document.deliveryUser = {};
        vm.document.deliveryClient = {};

        vm.backToList = () => {return $location.path('/');};

        vm.onChangeLocation = (data) => {
          vm.document.dt_others_ubigeo = data;
        };

        vm.isViewOnly = () => {
          return !((id && vm.currentUser.isAllowed('records', '_edit')) || !id);
        };

        vm.printRecord = () => {
          $window.open(`/publicAccess/print/${id}`, '_blank');
        };

        vm.showSender = () => {
          return id > 0 ? vm.document.sender_id > 0 : true;
        };

        vm.manifest = {
          isLoading: false
        };

        vm.uploadManifest = (file, binnacle_id) => {
          if (file) {
            vm.manifest.isLoading = true;
            Records.uploadManifest(file, binnacle_id).then(() => {
              vm.manifest.isLoading = false;
              notification.great('Manifiesto con código ' + binnacle_id + ' guardado exitosamente.');
            }, (errorMsg) => {
              vm.manifest.isLoading = false;
              notification.error(errorMsg);
            });
          }
        };

        vm.save = (form, stay) => {
          vm.stay = stay;
          vm.isSaveDisabled = true;

          if (preValidation()) {
            if (form.$valid) {
              if (id > 0) {
                DocumentSvc.update({id: id}, vm.document,
                  () => {
                    successHandler(false);
                  }, errorHandler);
              } else {
                if (vm.document.createInternalClient) {
                  vm.isSaveClientDisabled = false;
                  angular.element('#createInternalClient').modal();
                  vm.isSaveDisabled = false;
                } else {
                  DocumentSvc.save(vm.document,
                    () => {
                      successHandler(stay);
                    }, errorHandler);
                }
              }
            } else {
              vm.isSaveDisabled = false;
              notification.warn('Debe llenar todos los campos obligatorios.');
            }
          } else {
            vm.isSaveDisabled = false;
          }
        };

        vm.confirmCreateClient = () => {
          var internalClient = {
            short_name: vm.document.dt_others_para,
            name: vm.document.dt_others_para,
            address: vm.document.dt_others_address,
            ubigeo_id: vm.document.dt_others_ubigeo
          };
          vm.isSaveClientDisabled = true;
          angular.element('#createInternalClient').modal('toggle');

          InternalClients.save(internalClient, (resp) => {
            notification.great('Cliente Interno guardado correctamente.');
            InternalClients.get({id: resp.result.id}, (intClient) => {
              vm.deliveryClientConfig.initialValue = intClient.id;
              vm.document.delivery_type_id = '2';
              vm.document.deliveryClient = {
                value: intClient
              };
              DocumentSvc.save(vm.document,
                () => {
                  successHandler(vm.stay, intClient.id);
                }, errorHandler);
            }, errorHandler);
          }, errorHandler);
        };

        vm.isSaveDisabled = false;

        vm.senderConfig = {
          service: User,
          method: 'shortlist',
          displayValue: 'full_name',
          placeholder: 'Seleccione un usuario.',
          required: true,
          initialValue: undefined,
          onSelectItem: (item) => {
            User.get({id: item.id}, (result) => {
              vm.document.sender.value = {
                area_name: result.area_name,
                client_id: result.locate_client,
                id: result.id,
                last_name: result.last_name,
                name: result.name,
                office_name: result.office_name,
                ubigeo_desc: result.ubigeo_desc,
                ubigeo_id: result.ubigeo_id
              };
            }, () => {
              notification.error('Error obteniendo datos del remitente.');
            });
            if (!isBinnacleLoaded && id > 0) {
              getBinnacleData();
            }
          }
        };

        vm.deliveryUserConfig = {
          service: User,
          displayValue: 'full_name',
          placeholder: 'Seleccione un usuario.',
          required: true,
          initialValue: undefined,
          onSelectItem: (item) => {
            User.get({id: item.id}, (result) => {
              vm.document.deliveryUser.value = {
                area_name: result.area_name,
                client_id: result.locate_client,
                id: result.id,
                last_name: result.last_name,
                name: result.name,
                office_name: result.office_name,
                ubigeo_desc: result.ubigeo_desc,
                ubigeo_id: result.ubigeo_id
              };
            }, () => {
              notification.error('Error obteniendo datos del destinatario.');
            });
          }
        };

        vm.deliveryClientConfig = {
          service: InternalClients,
          custom_params: ['address', 'name'],
          displayValue: 'name',
          placeholder: 'Seleccione un cliente.',
          required: true,
          initialValue: undefined,
          onSelectItem: (item) => {
            vm.document.deliveryClient.value = item;
          }
        };

        loadDocument();
      }
    ]);
})();
