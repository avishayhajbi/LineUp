angular.module('starter.services', ['ngCordova']).config(['$provide', function($provide) {

    $provide.factory('$phoneManager', function($ionicPopup, $rootScope) {

        var myLocation = {
            longitufde: '',
            latitude: ''
        };

        //handle geolocation
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position);
            myLocation.latitude = position.coords.latitude;
            myLocation.longitude = position.coords.longitude;
            console.log('geoLocationSuccess : longitude:' + myLocation.longitude + ' latitude:' + myLocation.latitude);
        }, function(error) {
            console.log('geoLocationError');
            myLocation.longitude = false;
            myLocation.latitude = false;
        });

        return {
            getLocation: function() {
                return myLocation;
            }
        }
    });
    $provide.factory('$userManagment', function($rootScope, $http, $cordovaDialogs) {

        var myId = "";
        var fbId = "";
        var myName = "";
        var myEmail = "";
        var connected = false;

        ionic.Platform.ready(function() {
            debugger;
            var device = ionic.Platform.device();
            if (!device.uuid) myId = "browser";
            else myId = device.uuid;

            $http.get(serverUrl + 'userConnect', {
                params: {
                    userId: myId
                }
            }).then(function(response) {
                debugger;
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

        });
        // if (!window.cordova) {
        //   // Initialize - only executed when testing in the browser.
        //   facebookConnectPlugin.browserInit(800206223408829);
        // }

        // //check if user connected to facebook
        // facebookConnectPlugin.getLoginStatus(function(result) {

        //   if (result.status === "canconnected") {
        //     fbLoginSuccess(result);
        //     console.log("login:", result);
        //   }

        // }, function(result) {
        //   console.log("err:", result);
        // });

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
            getMyId: function() {
                if (myId)
                    return myId;
                return "noId";
            },
            getfbId: function() {
                if (fbId)
                    return fbId;
                return "noId";
            },
            isConnected: function() {
                return connected;
            },
            getMyName: function() {
                if (myName)
                    return myName;
                return "noName";
            },
            connectToFaceBook: function() {
                //user first login
                // facebookConnectPlugin.login(["public_profile,email"],
                //     fbLoginSuccess,
                //     function(error) {
                //         if (error) {
                //             console.log(error);
                //         } else {
                //             console.log("connected");
                //         }
                //     }

                // );
            },
            logOutFaceBook: function() {
                // facebookConnectPlugin.logout(function() {
                //     connected = false;
                //     myEmail = "";
                //     myName = "";
                //     fbId = "";
                // }, function() {})
            }
        }
    });

    $provide.factory('$outSideLineHandler', function($rootScope, $http, $meetingManager, $userManagment, $phoneManager) {

        var myLocation = false;
        var lines = false;
        var defaultLines = false;
        var lineInfo;

        setTimeout(function() {
            myLocation = $phoneManager.getLocation();
            $http.get(serverUrl + 'lineList')
                .then(function(response) {
                    lines = response.data;
                    if (myLocation) {
                        lines = orderLineList(myLocation, response.data);
                    }
                    defaultLines = lines;
                    console.log("lineList in search: ", lines);
                    $rootScope.$broadcast('lineListUpdated');
                });
        }, 2000);

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
                    },
                    timeout: 8000
                }).then(function(response) {
                    console.log("line got from server:", response.data);
                    if (!response.data) {
                        $rootScope.$broadcast('lineInfoArrived', false);
                        return;
                    }
                    lineInfo = response.data;
                    $rootScope.$broadcast('lineInfoArrived', true);
                }, function(res) {
                    $rootScope.$broadcast('lineInfoArrived', false);
                });

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
            getLineInfo: function() {
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

            //$localstorage.setObject('meetings', []);
            //$localstorage.setObject('canceldMeetings', []);

            if ($localstorage.getObject('meetings')) {
                var list = $localstorage.getObject('meetings');
                if (list.constructor === Array) {
                    meetings = list;
                } else meetings.push(list);
            }
            console.log("my meetings list:", meetings);

            if ($localstorage.getObject('canceldMeetings')) {
                var list = $localstorage.getObject('canceldMeetings');
                if (list.constructor === Array) {
                    canceldMeetings = list;
                } else canceldMeetings.push(list);
            }
            console.log("my canceldMeetings list:", canceldMeetings);
        }());

        function saveMeetingsLocal() {
            $localstorage.setObject('meetings', meetings);
            $localstorage.setObject('canceldMeetings', canceldMeetings);
            $rootScope.$broadcast('updateMyLists');
        }

        function moveToCanceld(id) {
            meetings = meetings.filter(function(obj) {
                if (obj.lineId === id) {
                    canceldMeetings.push(obj);
                    return false;
                }
                return true;
            });
            saveMeetingsLocal();
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

            currentMeeting.ProgressCounter = false;
            var startCount = new Date(time.getTime() - ((currentMeeting.confirmTime + currentMeeting.druation) * 60000));
            var timeToWait = time.getTime() - startCount;
            var timeInMs = Date.now();

            if (timeInMs > startCount.getTime()) {
                currentMeeting.ProgressCounter = true;
                var remainingTime = timeInMs - startCount;
                var progressWidth = (100 * remainingTime) / timeToWait;
                currentMeeting.progressWidth = progressWidth;
            }

        }

        function updateMeetingInfo() {

            if (!currentMeeting) {
                return;
            }
            $http.get(serverUrl + 'updateMeetingInfo', {
                params: {
                    lineId: currentMeeting.lineId,
                    userId: $userManagment.getMyId()
                },
                timeout: 8000
            }).then(function(response) {
                if (response.data) {
                    currentMeeting = response.data;
                    currentMeeting.ProgressCounter = false;
                    currentMeeting.progressWidth = 0;
                    for (var i = 0; i < meetings.length; i++) {
                        if (meetings[i].lineId == currentMeeting.lineId) {
                            meetings[i].time = currentMeeting.time;
                            saveMeetingsLocal();
                            break;
                        }
                    }
                    calculateTimeLeft();
                    console.log("meeting update:", currentMeeting);
                    $rootScope.$broadcast('updateMeetingInfo', true);
                }

            });

        }
        return {
            joinLine: function(lineInfo) {

                currentMeeting = lineInfo;
                $http.get(serverUrl + 'joinLine', {
                    params: {
                        lineId: currentMeeting.lineId,
                        userId: $userManagment.getMyId(),
                        userName: $userManagment.getMyName()
                    },
                    timeout: 8000
                }).then(function(response) {

                    if (response.data) {
                        currentMeeting.time = response.data;
                        var save = {
                            lineId: currentMeeting.lineId,
                            title: currentMeeting.title,
                            time: currentMeeting.time
                        };
                        meetings.push(save);
                        saveMeetingsLocal();
                        updateMeetingInfo();

                        $rootScope.$broadcast('signedToNewMeet', true);
                        return;
                    }
                    $rootScope.$broadcast('signedToNewMeet', false);

                });
            },
            getCurrentMeeting: function() {
                if (!currentMeeting) return;
                return currentMeeting;
            },
            updateMeeting: function() {
                if (!currentMeeting) {
                    return;
                }
                updateMeetingInfo();

            },
            cancelMeeting: function(meeting) {
                if (!meeting) return;

                $http.get(serverUrl + 'cancelMeeting', {
                    params: {
                        lineId: meeting.lineId,
                        userId: $userManagment.getMyId(),
                        time: meeting.time,
                        userName: $userManagment.getMyName()
                    },
                    timeout: 8000
                }).then(function(response) {
                    if (response.data) {
                        moveToCanceld(meeting.lineId);
                        $rootScope.$broadcast('meetingCancled', true);
                        return;
                    }
                    $rootScope.$broadcast('meetingCancled', false);
                }, function() {
                    $rootScope.$broadcast('meetingCancled', false);
                });

            },
            getMeetingList: function() {
                return meetings;
            },
            setCurrent: function(id) {

                for (var i = 0; i < meetings.length; i++) {
                    if (meetings[i].lineId === id) {
                        currentMeeting = meetings[i];
                        updateMeetingInfo();
                        break;
                    }
                }
            }
        }
    });

    $provide.factory('$lineManager', function($rootScope, $http, $userManagment, $localstorage) {
        var lineList = [];
        var passedLineList = [];
        var currentLine = {};

        // $localstorage.setObject('lineList', []);
        // $localstorage.setObject('passedLineList', []);

        if ($localstorage.getObject('lineList')) {
            var list = $localstorage.getObject('lineList');
            if (list.constructor === Array) {
                lineList = list;
            } else {
                lineList.push(list);
            }
        }
        if ($localstorage.getObject('passedLineList')) {
            var list = $localstorage.getObject('passedLineList');
            if (list.constructor === Array) {
                passedLineList = list;
            } else {
                passedLineList.push(list);
            }
        }
        console.log("my  passed lines list:", passedLineList);

        function saveLinesList() {
            $localstorage.setObject('lineList', lineList);
            $localstorage.setObject('passedLineList', passedLineList);
            $rootScope.$broadcast('updateMyLists');
        }

        function getLineInfo() {
            $http.get(serverUrl + 'getLineInfo', {
                params: {
                    lineId: currentLine.lineId,
                    lineManagerId: $userManagment.getMyId()
                },
                timeout: 8000
            }).then(function(response) {
                if (response.data) {
                    
                    currentLine = response.data;
                    console.log("getLineInfo: ", currentLine);
                    $rootScope.$broadcast('getLineInfo', true);
                } else {
                    $rootScope.$broadcast('getLineInfo', false);
                }
            }, function(response) {
                $rootScope.$broadcast('getLineInfo', false);
            });

        }

        return {
            createLine: function(line) {
                var save = {
                    title: line.title
                };
                line.lineManagerId = $userManagment.getMyId();
                $http.get(serverUrl + 'createLine', {
                    params: {
                        line: line
                    },
                    timeout: 8000
                }).then(function(response) {
                    if (response.data) {
                        currentLine.lineId = response.data;
                        save.lineId = response.data;
                        lineList.push(save);
                        saveLinesList();
                        $rootScope.$broadcast('lineCreated', true);
                        getLineInfo();
                    } else {
                        $rootScope.$broadcast('lineCreated', false);
                    }
                }, function(response) {
                    $rootScope.$broadcast('lineCreated', false);
                });

            },
            updateLineInfo: function(lineId) {
                for (var i = 0; i < lineList.length; i++) {
                    if (lineList[i].lineId === lineId) {
                        currentLine = lineList[i];
                        getLineInfo();
                        break;
                    }
                }
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
            endLine: function() {
                debugger;
                $http.get(serverUrl + 'endLine', {
                    params: {
                        lineId: currentLine.lineId,
                        lineManagerId: $userManagment.getMyId()
                    },
                    timeout: 8000
                }).then(function(response) {
                    debugger;
                    if (response.data) {
                        //TODO move line to passed lines
                        $rootScope.$broadcast('endLine', true);
                    } else {
                        $rootScope.$broadcast('endLine', false);
                    }
                }, function(response) {
                    $rootScope.$broadcast('endLine', false);
                });

            },
            postponeLine: function() {
                $http.get(serverUrl + 'postponeLine', {
                    params: {
                        lineId: currentLine.lineId,
                        lineManagerId: $userManagment.getMyId()
                    },
                    timeout: 8000
                }).then(function(response) {
                    if (response.data) {
                        $rootScope.$broadcast('postponeLine', true);
                        getLineInfo();
                    } else {
                        $rootScope.$broadcast('postponeLine', false);
                    }
                }, function(response) {
                    $rootScope.$broadcast('postponeLine', false);
                });
            },
            setCurrentLine: function(id) {

                for (var i = 0; i < lineList.length; i++) {
                    if (lineList[i].lineId === id) {
                        currentLine = lineList[i];
                        getLineInfo();
                        break;
                    }
                }
            },
            nextMeeting: function() {
                $http.get(serverUrl + 'nextMeeting', {
                    params: {
                        lineId: currentLine.lineId,
                        lineManagerId: $userManagment.getMyId()
                    },
                    timeout: 8000
                }).then(function(response) {
                    if (response.data) {
                        getLineInfo();
                        $rootScope.$broadcast('nextMeeting', true);
                    } else {
                        $rootScope.$broadcast('nextMeeting', false);
                    }
                }, function(response) {
                    $rootScope.$broadcast('nextMeeting', false);
                });

            }
        }
    });

    $provide.factory('$pushNotificationHere', function($rootScope, $http, $cordovaDialogs, $userManagment, $lineManager, $state) {

        ionic.Platform.ready(function() {
            var device = ionic.Platform.device();

            if (!window.cordova) return;

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
            debugger;
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
             debugger;
            // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
            //             via the console fields as shown.
            console.log("In foreground " + notification.foreground + " Coldstart " + notification.coldstart);
            if (notification.event == "registered") {

                console.log(notification.regid);
                //send device token to server
                sendTokenToServer(notification.regid);
            } else if (notification.event == "message") {

                switch (notification.message) {

                    case "101":
                        var currentTime = new Date(new Date().getTime()).getMinutes();
                        var meetingTime = new Date(notification.payload.key5).getMinutes();
                        var alertDate = meetingTime - currentTime;

                        $cordovaDialogs.alert("Line: " + notification.payload.key1 + "\nwill start in " + alertDate + " minutes", "LineUp informs you that:");
                        $lineManager.setCurrent(notification.key2);
                        $state.go("app.lineStatus");
                        break;

                    case "102":
                        $cordovaDialogs.alert("User name: " + notification.payload.key4 + "\nfrom Line: " + notification.payload.key1 + " canceled their meeting", "LineUp informs you that:");
                        $lineManager.setCurrent(notification.key2);
                        $state.go("app.lineStatus");
                        break;

                    case "103":
                        $cordovaDialogs.alert("Line: " + notification.payload.key1 + "\nis over.", "LineUp informs you that:");
                        $lineManager.setCurrent(notification.key2);
                        $state.go("app.lineStatus");
                        break;

                    case "201":
                        $cordovaDialogs.alert("Your meeting at: " + notification.payload.key1 + "\nis getting close..\n\nPlease confirm your arrival.", "LineUp informs you that:");
                        $lineManager.setCurrent(notification.key2);
                        $state.go("app.meetingStatus");
                        break;

                    case "202":
                        var meetingMinutes = new Date(notification.payload.key5).getMinutes();
                        var meetingHours = new Date(notification.payload.key5).getHours();

                        $cordovaDialogs.alert("You are next in Line:\n" + notification.payload.key1 + "\n\nYour meeting will start at: " + meetingHours + ":" + meetingMinutes, " LineUp informs you that:");
                        $lineManager.setCurrent(notification.key2);
                        $state.go("app.meetingStatus");
                        break;

                    case "203":

                        var str = notification.payload.key5;
                        var res = str.substr(0, 10);
                        var meetingMinutes = new Date(notification.payload.key5).getMinutes();
                        var meetingHours = new Date(notification.payload.key5).getHours();

                        $cordovaDialogs.alert("Your meeting in line:\n" + notification.payload.key1 + "\n\nwas preceded to:\n" + res + " " + meetingHours + ":" + meetingMinutes, "LineUp informs you that:");
                        $lineManager.setCurrent(notification.key2);
                        $state.go("app.meetingStatus");
                        break;

                    case "204":

                        var str = notification.payload.key5;
                        var res = str.substr(0, 10);
                        var meetingMinutes = new Date(notification.payload.key5).getMinutes();
                        var meetingHours = new Date(notification.payload.key5).getHours();
                        $cordovaDialogs.alert("Your meeting in line:\n" + notification.payload.key1 + "\n\nwas postponed to:\n" + res + " " + meetingHours + ":" + meetingMinutes, "LineUp informs you that:");
                        $lineManager.setCurrent(notification.key2);
                        $state.go("app.meetingStatus");
                        break;

                    case "206":
                        $cordovaDialogs.alert("Your meeting in line:\n" + notification.payload.key1 + "\n\nwas canceled", "LineUp informs you that:");
                        break;

                    case "207":
                        $cordovaDialogs.alert("Your meeting in line:\n" + notification.payload.key1 + "\nis starting!", "LineUp informs you that:");
                        $lineManager.setCurrent(notification.key2);
                        $state.go("app.meetingStatus");
                        break;
                    case "newUserInLine":
                        $lineManager.updateLineInfo(notification.key1);
                        $cordovaDialogs.alert("new user in line");
                        break;
                    case "userCancelDmeeting":
                        $lineManager.updateLineInfo(notification.key1);
                        $cordovaDialogs.alert("user canceld meeting");
                        break;
                    default:
                        $cordovaDialogs.alert("you got a defualt message!", "LineUp informs you that:");
                }

            } else if (notification.event == "error")
                $cordovaDialogs.alert(notification.msg, "Push notification error event");
            else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
        }

        window.sendTokenToServer = function(token) {

            $http.get(serverUrl + 'pushToken', {
                params: {
                    userId: $userManagment.getMyId(),
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
        return {}
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