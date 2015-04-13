angular.module('starter.services', ['ngCordova']).config(['$provide', function($provide) {

  $provide.factory('phoneManager', function($ionicPopup, $cordovaSocialSharing, $rootScope) {
    var device, uuid;
    var myID = "tempID";
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
      },
      getMyId: function() {
        return myID;
      }
    }
  });

  $provide.factory('outSideLineHandler', function($rootScope, $http, phoneManager) {

    var myLocation = false;
    var lines = false;
    var defaultLines = false;
    var lineInfo;
    $rootScope.$on('geoishere', function(event) {
      myLocation = phoneManager.getLocation();
      // getListOfOpenLines from server with mygeo location
      $http.get(serverUrl + 'lineList')
        .then(function(response) {
          lines = orderLineList(myLocation, response.data);
          defaultLines = lines;
          console.log(lines);
          $rootScope.$broadcast('lineListUpdated');
        });
    });

    function orderLineList(myLocation, lines) {

      for (var i = 0; i < lines.length; i++) {
        var dX = Math.abs(myLocation.latitude - lines[i].location.latitude);
        var dY = Math.abs(myLocation.longitude - lines[i].location.longitude);
        var distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        lines[i].distanceFromMe = distance;
      }
      lines.sort(function(a, b) {
        return a.distanceFromMe - b.distanceFromMe;
      });
      return lines;
    }

    return {
      getLineList: function() {
        return lines;
      },
      getDefaultLineList: function() {
        return defaultLines;
      },
      getLine: function(lineId) {
        $http.get(serverUrl + 'getLine', {
          params: {
            lineId: lineId
          }
        }).then(function(response) {
          if (response.data != false) {
            lineInfo = response.data[0];
            $rootScope.$broadcast('lineInfoArrived', true);
          } else {
            $rootScope.$broadcast('lineInfoArrived', false);
          }
        });

      },
      getLineInfo: function() {
        return lineInfo;
      },
      searchLineByName: function(value) {
        $http.get(serverUrl + 'searchLineList', {
          params: {
            value: value
          }
        }).then(function(response) {
          if (response.data !== 'null') {
            lines = orderLineList(myLocation, response.data);
            console.log("new line list by search:");
            console.log(lines);
            $rootScope.$broadcast('lineListUpdated');
          }
        });
      }
    }
  });
  $provide.factory('meetingSender', function($rootScope, $http) {

    var meetings = [];
    var currentMeeting;

    return {
      requestMeeting: function(meeting) {
        console.log("insert my meeting:" + meeting);
        $http.get(serverUrl + 'requestMeeting', {
          params: {
            meeting: meeting
          }
        }).then(function(response) {
          if (response.data !== 'null' && response.data.ok !== 'null' && response.data.meeting !== 'null') {
            $rootScope.$broadcast('signedToNewMeet', {
              meeting: response.data.meeting
            });
          } else {
            $rootScope.$broadcast('signedToNewMeet', false);

          }

        });

      }

    }
  });

  $provide.factory('meetingListener', function($rootScope, $http) {
    return {

    }
  });

  $provide.factory('meetingManager', function($rootScope, meetingSender, meetingListener) {

    var meetings = [];
    var currentMeeting;

    //listen to meeting sender to confirm the meet
    $rootScope.$on('signedToNewMeetTrue', function(event, args) {
      if (args.ok === false) {
        $rootScope.$broadcast('newMeetingArrived', false);
      } else {
        currentMeeting = args.meeting;
        $rootScope.$broadcast('newMeetingArrived', true);
      }
    });

    return {
      requestMeeting: function(meeting) {
        meetingSender.requestMeeting(meeting);
      }
    }
  });

  $provide.factory('lineManager', function($rootScope, $http, phoneManager) {
    var lineList = [];
    var currentLine;
    return {
      createLine: function(line) {
        line.lineManagerId = phoneManager.getMyId();
        console.log('line is:' + line);
        $http.get(serverUrl + 'createLine', {
          params: {
            line: line
          }
        }).then(function(response) {
          if (response.data !== 'null' && response.data.ok !== 'null' && response.data._id !== 'null') {
            console.log(response);
            line._id = response.data._id;
            lineList.push(line);
            currentLine = line;
            $rootScope.$broadcast('lineCreated', true);
          } else {
            $rootScope.$broadcast('lineCreated', false);
          }
        }, function(response) {
          $rootScope.$broadcast('lineCreated', false);
        });
      }
    }
  });

}]);