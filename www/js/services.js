angular.module('starter.services', ['ngCordova']).config(['$provide', function($provide) {

  $provide.factory('phoneManager', function($ionicPopup, $cordovaSocialSharing, $rootScope) {

    var device, uuid;
    var myLocation = {
      longitude: '',
      latitude: ''
    };

    ionic.Platform.ready(function() {
      device = ionic.Platform.device();
      uuid = device.uuid;
    });

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    function onSuccess(position) {
      console.log(position);
      myLocation.latitude = position.coords.latitude;
      myLocation.longitude = position.coords.longitude;
      console.log('geoLocationSuccess : longitude:' + myLocation.longitude + ' latitude:' + myLocation.latitude);
      $rootScope.$broadcast('geoishere');
    }

    function onError(error) {
      console.log('geoLocationError');
      myLocation.longitude = false;
      myLocation.latitude = false;
      $rootScope.$broadcast('geoishere');
    }

    return {
      shareAnywhere: function(title, subject, img, url) {
        $cordovaSocialSharing.share(title, subject, img, url);
      },
      getLocation: function() {
        return myLocation;
      }
    }
  });

  $provide.factory('outSideLineHandler', function($rootScope, $http, phoneManager) {

    var myLocation = false;
    var lines = false;
    var defaultLines = false;
    $rootScope.$on('geoishere', function(event) {
      myLocation = phoneManager.getLocation();

      // getListOfOpenLines from server with mygeo location
      $http.get('http://localHost:3030/api/lineList', {
        params: {
          location: myLocation
        }
      }).then(function(response) {
        console.log(typeof response);
        lines = response.data;
        defaultLines = lines;
        console.log(lines);

        $rootScope.$broadcast('lineListUpdated');
      });
    });


    return {
      getLineList: function() {
        return lines;
      },
      getDefaultLineList: function() {
        return defaultLines;
      },
      getLine: function(lineId) {
        //return object or false from server;
        return true;
        // List = get http  
      },
      searchLineByName: function(value) {

        $http.get('http://localHost:3030/api/searchlineList', {
          params: {
            value: value,
            location: myLocation
          }
        }).then(function(response) {
          if (response.data !== 'null') {
            lines = response.data;
            console.log("new line list by search:" + lines);
            $rootScope.$broadcast('lineListUpdated');
          }
        });
      }
    }
  });

}]);