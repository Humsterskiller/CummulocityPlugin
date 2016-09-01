//Main module name must be defined in ngModules of the plugin manifest
angular.module('app.bismark', []).config([
  'c8yNavigatorProvider', 'c8yViewsProvider',
  function(c8yNavigatorProvider, c8yViewsProvider) {
    'use strict';

    c8yNavigatorProvider.addNavigation({
      name: 'New plugin',
      icon: 'cube',
      priority: 100000,
      path: 'dummy'
    });

    c8yViewsProvider.when('/dummy', {
      // Please use this string placeholder where you want to refer you plugin path.
      templateUrl: ':::PLUGIN_PATH:::/views/index.html',
      controller: 'mh_MainCtrl'
    });

  }
]);

angular.module('app.bismark').controller('mh_MainCtrl', ['$scope', 'c8yDevices',
  function($scope, c8yDevices, nvd3) {
    'use strict ';
    this.tab = 1;
    this.setTab = function(newValue) {
      this.tab = newValue;
      console.log('new value for tab : ', this.tab)
    };
    this.isSet = function(tabName) {
      return this.tab === tabName;
    };
    c8yDevices.list().then(function(devices) {
      'use strict';
      $scope.mDevices = [];
      $scope.mDevicesOnline = [];
      $scope.mDevicesOffline = [];

      $scope.options = {
        chart: {
          type: 'pieChart',
          height: 300,
          x: function(d) {
            return d.key;
          },
          y: function(d) {
            return d.y;
          },
          showLabels: true,
          duration: 300,
          labelThreshold: 0.01,
          labelSunbeamLayout: true,
          legend: {
            margin: {
              top: 5,
              right: 35,
              bottom: 5,
              left: 0
            }
          }
        },
        title: {
          enable: true,
          text: 'Uptime General'
        }
      };
      angular.forEach(devices, function(device) {
        if (device.type == 'Bsk_bankDevice') {
          $scope.mDevices.push(device);
          if (device.c8y_Availability.status == 'AVAILABLE') {
            $scope.mDevicesOnline.push(device);
          } else {
            $scope.mDevicesOffline.push(device);
          }
        }
      });
      $scope.data = [{
        key: "OnLine",
        y: $scope.mDevicesOnline.length
      }, {
        key: "OffLine",
        y: $scope.mDevicesOffline.length
      }];
      console.log('devices OnLine: ' + $scope.mDevicesOnline.length);
      console.log('devices OffLine: ' + $scope.mDevicesOffline.length);
    });

  }
]);
