angular.module('starter.services', ['ngCordova']).config(['$provide', function($provide) {

  $provide.factory('$phoneManager', function($ionicPopup, $rootScope) {
    var device;

    var myLocation = {
      longitufde: '',
      latitude: ''
    };

    ionic.Platform.ready(function() {
      device = ionic.Platform.device();

    });

    //handle geolocation
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      myLocation.latitude = position.coords.latitude;
      myLocation.longitude = position.coords.longitude;
      console.log('geoLocationSuccess : longitude:' + myLocation.longitude + ' latitude:' + myLocation.latitude);
      $rootScope.$broadcast('geoishere', true);
    }, function(error) {
      console.log('geoLocationError');
      myLocation.longitude = false;
      myLocation.latitude = false;
      $rootScope.$broadcast('geoishere', false);

    });

    return {
      getLocation: function() {
        return myLocation;
      }
    }
  });
  $provide.factory('$userManagment', function($rootScope, $http) {

    var myId = "";
    var fbId = "";
    var myName = "";
    var myEmail = "";
    var connected = false;


    ionic.Platform.ready(function() {
      var device = ionic.Platform.device();
      if (!device.uuid) myId = "browser";
      else myId = device.uuid;

      $http.get(serverUrl + 'userConnect', {
        params: {
          userId: myId
        }
      }).then(function(response) {
        if (response.data === "exist") {
          console.log("user returnd:", response);
        }
        if (response.data === "newUser") {
          console.log("new User", response);
        }
        if (!response.data) {
          console.log("error in login user", response);
        }

      }, function(err) {
        console.log("error in user connection:", err);
      });


      if (!window.cordova) {
        // Initialize - only executed when testing in the browser.
        facebookConnectPlugin.browserInit(800206223408829);
      }

      //check if user connected to facebook
      facebookConnectPlugin.getLoginStatus(function(result) {

        if (result.status === "connected") {
          fbLoginSuccess(result);
          console.log("login:", result);
        }

      }, function(result) {
        console.log("err:", result);
      });

      //active push notification
      window.pushNotification = window.plugins.pushNotification;
      if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
        pushNotification.register(
          pushSuccess,
          pushError, {
            "senderID": '205633341244',
            "ecb": "onNotification"
          });
      } else if (device.platform == 'blackberry10') {
        pushNotification.register(
          pushSuccess,
          pushError, {
            invokeTargetId: "replace_with_invoke_target_id",
            appId: "replace_with_app_id",
            ppgUrl: "replace_with_ppg_url", //remove for BES pushes
            ecb: "onNotification",
            simChangeCallback: replace_with_simChange_callback,
            pushTransportReadyCallback: replace_with_pushTransportReady_callback,
            launchApplicationOnPush: true
          });
      } else {
        pushNotification.register(
          pushIosSuccess,
          pushError, {
            "badge": "true",
            "sound": "true",
            "alert": "true",
            "ecb": "onNotification"
          });
      }

    });

    function pushSuccess(result) {

      console.log('signed to push:' + result);
    }

    function pushError(error) {

      console.log('signed to push:' + error);
    }

    function pushIosSuccess(result) {

    }

    //handle notification
    window.onNotification = function(e) {

        if (ionic.Platform.isAndroid()) {
          window.handleAndroid(e);
        } else if (ionic.Platform.isIOS()) {
          handleIOS(e);
          $scope.$apply(function() {
            $scope.notifications.push(JSON.stringify(e.alert));
          })
        }
      }
      //push from android
    window.handleAndroid = function(notification) {
      // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
      //             via the console fields as shown.
      console.log("In foreground " + notification.foreground + " Coldstart " + notification.coldstart);
      if (notification.event == "registered") {

        console.log(notification.regid);
        //send device token to server
        sendTokenToServer(notification.regid);
      } else if (notification.event == "message") {
        if (notification.message == "newUserSignedToLine") {
          $rootScope.$broadcast("newUserSignedToLine" , notification.key1);
        }
        else {
          $cordovaDialogs.alert(notification.message, "Push Notification Received");
        }

      } else if (notification.event == "error")
        $cordovaDialogs.alert(notification.msg, "Push notification error event");
      else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
    }


    window.sendTokenToServer = function(token) {

      $http.get(serverUrl + 'pushToken', {
        params: {
          userId: myId,
          pushToken: token
        }
      }).then(function(response) {
        console.log("push Token Recived:", response);

      }, function(err) {
        console.log("push Token Recived err:", err);
      });
    }

    //       // IOS Notification Received Handler
    // function handleIOS(notification) {
    //   // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
    //   // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
    //   // the notification when this code runs (weird).
    //   if (notification.foreground == "1") {
    //     // Play custom audio if a sound specified.
    //     if (notification.sound) {
    //       var mediaSrc = $cordovaMedia.newMedia(notification.sound);
    //       mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
    //     }

    //     if (notification.body && notification.messageFrom) {
    //       $cordovaDialogs.alert(notification.body, notification.messageFrom);
    //     } else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

    //     if (notification.badge) {
    //       $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
    //         console.log("Set badge success " + result)
    //       }, function(err) {
    //         console.log("Set badge error " + err)
    //       });
    //     }
    //   }
    //   // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
    //   // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
    //   // the data in this situation.
    //   else {
    //     if (notification.body && notification.messageFrom) {
    //       $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
    //     } else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
    //   }
    // }



    //connect to facebook
    var fbLoginSuccess = function(userData) {

      fbId = userData.authResponse.userID;

      facebookConnectPlugin.api(fbId + "/?fields=id,email,name", [],
        function(result) {

          connected = true;
          myEmail = result.email;
          myName = result.name;
          $rootScope.$broadcast('connectedToFB');
          saveUser();
        },
        function(error) {
          console.log("Failed: ", error);
        });

    }

    //save user in db
    function saveUser() {

      var send = {
        fbId: fbId,
        userId: myId,
        email: myEmail
      };

      if (myName) {
        send.name = myName;
      }

      $http.get(serverUrl + 'connectToFB', {
        params: send
      }).then(function(response) {

        if (response.data === "signed") {
          console.log("welcome back fbUser:" + myName);
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
      getmyId: function() {
        return myId;
      },
      getfbId: function() {
        return fbId;
      },
      isConnected: function() {
        return connected;
      },
      getMyName: function() {
        return myName;
      },
      connectToFaceBook: function() {
        //user first login
        facebookConnectPlugin.login(["public_profile,email"],
          fbLoginSuccess,
          function(error) {
            if (error) {
              console.log(error);
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
          fbId = "";
        }, function() {})
      }
    }
  });

  $provide.factory('$outSideLineHandler', function($rootScope, $http, $meetingManager, $userManagment, $phoneManager) {

    var myLocation = false;
    var lines = false;
    var defaultLines = false;
    var lineInfo;

    $rootScope.$on('geoishere', function(event, args) {
      if (args) {
        myLocation = $phoneManager.getLocation();
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
        
        lineInfo = tempLine;
        setTimeout(function() {
            $rootScope.$broadcast('lineInfoArrived', true);
        }, 1000);
        
        /*
        $http.get(serverUrl + 'getLine', {
          params: {
            lineId: lineId
          },
          timeout: 8000
        }).then(function(response) {
          lineInfo = response.data;
          $rootScope.$broadcast('lineInfoArrived', true);  
        },function(res){
          $rootScope.$broadcast('lineInfoArrived', false);  
        });

        */
      },
      searchLineByName: function(value) {
        $http.get(serverUrl + 'searchLineList', {
          params: {
            value: value
          }
        }).then(function(response) {

          if (response.data) {
            lines = orderLineList(myLocation, response.data);
            $rootScope.$broadcast('lineListUpdated');
          }
        });
      },
      getLineInfo :function() {

        return lineInfo;
      }
    }
  });

  $provide.factory('$meetingManager', function($rootScope, $http, $userManagment, $localstorage) {

    var meetings = [];
    var canceldMeetings = [];
    var passedMeetings = [];
    var currentMeeting;


    (function() {
      $localstorage.setObject('meetings', []);
      $localstorage.setObject('canceldMeetings', []);

      if ($localstorage.getObject('meetings')) {
        var list = $localstorage.getObject('meetings');
        if (list.constructor === Array) {
          meetings = list;
        } else meetings.push(list);
      }
      console.log("meetings list:", meetings);

      if ($localstorage.getObject('canceldMeetings')) {
        var list = $localstorage.getObject('canceldMeetings');
        if (list.constructor === Array) {
          canceldMeetings = list;
        } else canceldMeetings.push(list);
      }
      console.log("canceldMeetings list:", canceldMeetings);
    }());


    function saveMeetingLocal() {
      $localstorage.setObject('meetings', meetings);
      $localstorage.setObject('canceldMeetings', canceldMeetings);
    }

    function moveToCanceld(id) {

      meetings = meetings.filter(function(obj) {
        if (obj.id === id) {
          canceldMeetings.push(obj);
          return false;
        }
        return true;
      });
      saveMeetingLocal();

    }

    function saveCurrnet() {
      for (var i = 0; i < meetings.length; i++) {
        if (meetings[i].id == currentMeeting.id) {
          meetings[i].position = currentMeeting.position;
          meetings[i].timeLeft = currentMeeting.timeLeft;
          saveMeetingLocal();
          break;
        }
      }
    }

    function calculateTimeLeft() {
      var time = new Date(currentMeeting.time);
      var now = new Date();
      var difference = new Date(time - now);

      tz_correction_minutes = now.getTimezoneOffset() - difference.getTimezoneOffset();
      difference.setMinutes(time.getMinutes() + tz_correction_minutes);
      currentMeeting.timeLeft = {
        days: difference.getDate() - 1,
        hours: difference.getHours(),
        minutes: difference.getMinutes()
      };
    }

    function updatePosition() {
      $http.get(serverUrl + 'meetingPosition', {
        params: {
          lineId: currentMeeting.id,
          userId: $userManagment.getmyId()
        },
        timeout: 8000
      }).then(function(response) {
        if (response.data) {
          if (currentMeeting.position != response.data) {
            currentMeeting.position = response.data;
            $rootScope.$broadcast('positionUpdated');
            saveCurrnet();
          }
        }

      }, function(response) {
        console.log("answer from meetingPosition timeout");
      });
    }
    return {
      joinLine: function(lineInfo) {
        
        currentMeeting = lineInfo;
        var info = {
          lineId: currentMeeting.lineId,
          userId: $userManagment.getmyId(),
          userName: $userManagment.getMyName()
        }
        $http.get(serverUrl + 'joinLine', {
          params: {
            meeting: info
          },
          timeout: 8000
        }).then(function(response) {
          if (response.data) {
            currentMeeting.time = response.data;
            calculateTimeLeft();
            meetings.push(currentMeeting);
            $rootScope.$broadcast('signedToNewMeet', true);
            saveMeetingLocal();
            return;
          }
          $rootScope.$broadcast('signedToNewMeet', false);

        });
      },
      getCurrentMeeting: function() {
        return currentMeeting;
      },
      setLineInfo: function(line) {
        console.log("setLineInfo:", line);
        currentMeeting = line;
        $rootScope.$broadcast('LineInfoInManager');
      },
      updateMeeting: function() {
        if (!currentMeeting) {
          return;
        }
        calculateTimeLeft();
        updatePosition();
      },
      cancelMeeting: function(meeting) {

        if (!meeting) return;
        var toCancel = {
          lineId: meeting.id,
          userId: $userManagment.getmyId(),
          time: meeting.time,
          userName: $userManagment.getMyName()
        };

        $http.get(serverUrl + 'cancelMeeting', {
          params: {
            toCancel: toCancel
          },
          timeout: 8000
        }).then(function(response) {
          if (response.data) {
            moveToCanceld(meeting.id);
            $rootScope.$broadcast('meetingCancled', true);
            return;
          }
          $rootScope.$broadcast('meetingCancled', false);
        });

      },
      chooseMeeting: function(id) {
        for (var i = 0; i < meetings.length; i++) {
          if (meetings.id === id) {
            currentMeeting = meetings[i];
            break;
          }
        }
      },
      getMeetingList: function() {
        return meetings;
      },
      setCurrent: function(id) {
        for (var i = 0; i < meetings.length; i++) {
          if (meetings[i].id === id) {
            currentMeeting = meetings[i];
            break;
          }
        }
      }
    }
  });

  $provide.factory('$lineManager', function($rootScope, $http, $userManagment, $localstorage) {
    var lineList = [];
    var currentLine;

    $localstorage.setObject('lineList', []);
    if ($localstorage.getObject('lineList')) {
      var list = $localstorage.getObject('lineList');
      if (list.constructor === Array) {
        lineList = list;
      } else lineList.push(list);
    }
    console.log("lineList list:", lineList);

    function saveLineLocal() {
      $localstorage.setObject('lineList', lineList);
    }

    $rootScope.$on("newUserSignedToLine" , function (evt , lineId){


         $http.get(serverUrl + 'createLine', {
          params: {
            line: line
          },
          timeout: 8000
        }).then(function(response) {
          if (checkAtt(response.data)) {
            line.id = response.data;
            lineList.push(line);
            currentLine = line;
            saveLineLocal();
            $rootScope.$broadcast('lineCreated', true);
          } else {
            $rootScope.$broadcast('lineCreated', false);
          }
        }, function(response) {
          $rootScope.$broadcast('lineCreated', false);
        });

    });
    

    return {
      createLine: function(line) {
        line.lineManagerId = $userManagment.getmyId();
        console.log('line is:', line);
        $http.get(serverUrl + 'createLine', {
          params: {
            line: line
          },
          timeout: 8000
        }).then(function(response) {
          if (checkAtt(response.data)) {
            line.id = response.data;
            lineList.push(line);
            currentLine = line;
            saveLineLocal();
            $rootScope.$broadcast('lineCreated', true);
          } else {
            $rootScope.$broadcast('lineCreated', false);
          }
        }, function(response) {
          $rootScope.$broadcast('lineCreated', false);
        });

      },

      getCurrentLine: function() {
        if (!currentLine) return false;
        else {
          return currentLine;
        }
      },
      getLineList: function() {
        if (!lineList) return false;
        else {
          return lineList;
        }

      },
      setCurrent: function(id) {
        for (var i = 0; i < lineList.length; i++) {
          if (lineList[i].id === id) {
            currentLine = lineList[i];
            break;
          }
        }
      },
      nextMeeting : function() { 

      }
    }
  });


  $provide.factory('$localstorage', ['$window', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }]);



}]);