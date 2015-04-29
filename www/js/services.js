angular.module('starter.services', ['ngCordova']).config(['$provide', function($provide) {

  $provide.factory('phoneManager', function($ionicPopup, $cordovaSocialSharing, $rootScope) {
    var device, uuid;

    var myLocation = {
      longitufde: '',
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
      $rootScope.$broadcast('geoishere', true);
    }

    function onError(error) {
      console.log('geoLocationError');
      myLocation.longitude = false;
      myLocation.latitude = false;
      $rootScope.$broadcast('geoishere', false);
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
  $provide.factory('userManagment', function($rootScope, $http) {
    var myFBID = "";
    var myID = "";
    var myName = "";
    var myEmail = "";
    var connected = false;

    setTimeout(function() {
      facebookConnectPlugin.getLoginStatus(function(result) {
        fbLoginSuccess(result);
        console.log("login:", result);
      }, function(result) {
        console.log("err:", result);

      });

    }, 2000);


    var fbLoginSuccess = function(userData) {
      myFBID = userData.authResponse.userID;

      facebookConnectPlugin.api(myFBID + "/?fields=id,email,name", [],
        function(result) {
          debugger;
          connected = true;
          myEmail = result.email;
          myName = result.name;
          $rootScope.$broadcast('connectedToFB');
          saveUser(result);
        },
        function(error) {
          console.log("Failed: ", error);
        });

    }


    function saveUser(user) {
      user.userId = user.id;
      delete user.id;
      $http.get(serverUrl + 'connectToFB', {
        params: {
          user: user
        }
      }).then(function(response) {

        if (response.data === "signed") {
          console.log("welcome back:" + myName);
        } else if (!response.data) {
          console.log("fail to save user");
        } else {
          console.log("user saved in DB");
        }
        
      }, function(err) {
        console.log("server not responding", err);
        
      });
    }


    return {
      getMyId: function() {
        return myID;
      },
      getMyFBId: function() {
        return myFBID;
      },
      isConnected: function() {
        return connected;
      },
      getMyName: function() {
        return myName;
      },
      connectToFaceBook: function() {
        facebookConnectPlugin.login(["public_profile,email"],
          fbLoginSuccess,
          function(error) {
            if (error) {
              console.log("" + error);
            } else {
              console.log("connected");
            }
          }

        );
      },
      logOutFaceBook: function() {
        facebookConnectPlugin.logout(function() {
          connected = false;
          myEmail = "";
          myName = "";
        }, function() {})
      }
    }
  });
  $provide.factory('outSideLineHandler', function($rootScope, $http, meetingManager, userManagment) {

    var myLocation = false;
    var lines = false;
    var defaultLines = false;
    var lineInfo;

    $rootScope.$on('geoishere', function(event, args) {
      if (args) {
        myLocation = phoneManager.getLocation();
      }
      // getListOfOpenLines from server with mygeo location
      $http.get(serverUrl + 'lineList')
        .then(function(response) {
          lines = response.data;
          if (args) {
            lines = orderLineList(myLocation, response.data);
          }
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
            lineId: lineId,
            userId: userManagment.getMyId()
          },
          timeout: 8000
        }).then(function(response) {

          console.log("line info:", response.data);
          if (!response.data) {
            $rootScope.$broadcast('lineInfoArrived', false);
            return;
          } else if (response.data === "noRoom") {
            $rootScope.$broadcast('lineInfoArrived', "noRoom");
            return;
          } else if (response.data === "signed") {
            $rootScope.$broadcast('lineInfoArrived', "signed");
            return;
          }
          meetingManager.setLineInfo(response.data);
          $rootScope.$broadcast('lineInfoArrived', true);
        });

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
      confirmMeeting: function(meeting) {
        $http.get(serverUrl + 'confirmMeeting', {
          params: {
            meeting: meeting
          },
          timeout: 8000
        }).then(function(response) {
          if (response.data !== 'null' && response.data !== '' && response.data !== false) {
            $rootScope.$broadcast('signedToNewMeet', true);
            return;
          }
          $rootScope.$broadcast('signedToNewMeet', false);

        }).then(function(response) {
          $rootScope.$broadcast('signedToNewMeet', false);
        });

      }

    }
  });

  $provide.factory('meetingListener', function($rootScope, $http) {
    return {

    }
  });

  $provide.factory('meetingManager', function($rootScope, $http, meetingSender, meetingListener, userManagment) {

    var meetings = [];
    var currentMeeting;


    return {
      confirmMeeting: function() {
        var toConfirm = {
          lineId: currentMeeting._id,
          time: currentMeeting.time,
          userId: userManagment.getMyId(),
          userName: userManagment.getMyName()
        }
        $http.get(serverUrl + 'confirmMeeting', {
          params: {
            meeting: toConfirm
          },
          timeout: 8000
        }).then(function(response) {
          if (response.data !== 'null' && response.data !== '' && response.data !== false) {
            currentMeeting.active = true;
            meetings.push(currentMeeting);
            $rootScope.$broadcast('signedToNewMeet', true);
            return;
          }
          $rootScope.$broadcast('signedToNewMeet', false);

        });
      },
      getCurrentMeeting: function() {
        return currentMeeting;
      },
      setLineInfo: function(line) {

        currentMeeting = line;
        currentMeeting.time = currentMeeting.nextMeeting;
        currentMeeting.position = 0;
        delete currentMeeting.availableDates;
        $rootScope.$broadcast('LineInfoInManager');
      },
      getPosition: function() {
        if (!currentMeeting) {
          return;
        }
        var pos = {
          lineId: currentMeeting._id,
          userId: userManagment.getMyId()
        }
        $http.get(serverUrl + 'getPosition', {
          params: {
            meeting: pos
          },
          timeout: 8000
        }).then(function(response) {

          if (response.data !== 'null' && response.data !== '' && response.data !== false) {
            currentMeeting.position = response.data;
            $rootScope.$broadcast('positionArrived', currentMeeting.position);
            return;
          }
          $rootScope.$broadcast('positionArrived', false);

        });

      },
      cancelMeeting: function(meeting) {

        if (!meeting) return;
        var toCancel = {
          lineId: meeting._id,
          userId: userManagment.getMyId(),
          time: meeting.time
        };

        $http.get(serverUrl + 'cancelMeeting', {
          params: {
            toCancel: toCancel
          },
          timeout: 8000
        }).then(function(response) {

          if (response.data !== 'null' && response.data !== '' && response.data !== false) {
            $rootScope.$broadcast('meetingCancled', true);
            return;
          }
          $rootScope.$broadcast('meetingCancled', false);
        });

      }
    }
  });

  $provide.factory('lineManager', function($rootScope, $http, userManagment) {
    var lineList = [];
    var currentLine;
    return {
      createLine: function(line) {
        line.lineManagerId = userManagment.getMyId();
        console.log('line is:', line);
        $http.get(serverUrl + 'createLine', {
          params: {
            line: line
          },
          timeout: 8000
        }).then(function(response) {
          if (response.data !== 'null' && response.data !== 'null' && response.data !== false) {
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

      },

      getCurrentLine: function (){
        return currentLine;
      },
    }
  });


  $provide.factory('userManager', function($rootScope, $http, meetingSender, meetingListener, phoneManager) {

      return {
        loginViaEmail: function(data) {
          console.log(data);

         $http.get(serverUrl + 'createLine', {
          params: {
            loginData: data
          },
          timeout: 8000
        }).then(function(response) {
          if (response.data !== 'null' && response.data !== false) {
            $rootScope.$broadcast('loginAttempt', true);
          } else {
            $rootScope.$broadcast('loginAttempt', false);
          }
        });
        }

      }

  });

}]);
