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
	$provide.factory('$userManagment', function($rootScope, $http, $cordovaDialogs, $localstorage) {

		var userId = "";
		var deviceId = "";
		var fbId = "";
		var username = "";
		var userEmail = "";
		var pushToken = false;
		var connected = false;


		ionic.Platform.ready(function() {
			var device = ionic.Platform.device();
			if (!device.uuid) deviceId = "browser";
			else deviceId = device.uuid;
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


		window.sendTokenToServer = function(token) {

			pushToken = token;
			if (userId) {
				$http.get(serverUrl + 'pushToken', {
					params: {
						userId: userId,
						pushToken: token
					}
				}).then(function(response) {
					console.log("push Token Recived:", response);

				}, function(err) {
					console.log("push Token Recived err:", err);
				});

			}
		}

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

		return {
			getMyId: function() {
				if (userId)
					return userId;
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
				if (username)
					return username;
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
			},
			loginWithEmail: function(user) {
				return $http.post(serverUrl + 'logIn', user)
					.then(function(response) {

						if (response.data.success) {
							username = response.data.user.username;
							userId = response.data.user._id;
							delete response.data.user._id;
							$localstorage.setObject('lineup', {
								username: user.username,
								password: user.password
							});
							if (pushToken) {
								sendTokenToServer(pushToken);
							}
							console.log("user login :", username);
							return response.data.user;
						} else {
							$localstorage.setObject('lineup', '');
							return false;
						}
					}, function() {
						$localstorage.setObject('lineup', '');
						console.log("time out login user");
						return false;
					});
			},
			signUpWithEmail: function(user) {
				return $http.post(serverUrl + 'signUp', user)
					.then(function(response) {
						if (response.data.success == 'userExist') {
							return response.data.success;
						} else if (response.data.success) {
							username = response.data.user.username;
							userId = response.data.user._id;
							delete response.data.user._id;
							$localstorage.setObject('lineup', {
								username: user.username,
								password: user.password
							});
							if (pushToken) {
								sendTokenToServer(pushToken);
							}
							console.log("user login :", username);
							return response.data.user;
						} else {
							$localstorage.setObject('lineup', '');
							return false;
						}

					}, function() {
						console.log("time out login user");
						$localstorage.setObject('lineup', '');
						return false;
					});
			},
			logOut: function() {
				userId = "";
				username = "";
				userEmail = "";
				connected = false;

			},
			updateLists: function() {
				return $http.get(serverUrl + 'updateLists', {
					params: {
						userId: userId
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data) {
						return response.data;
					} else {
						return false;
					}
				}, function(response) {
					return false;
				});
			}
		}
	});

	$provide.factory('$outSideLineHandler', function($rootScope, $http, $meetingManager, $userManagment, $phoneManager, $lineManager) {

		var myLocation = false;
		var lines = false;
		var defaultLines = false;
		var lineInfo;


		myLocation = $phoneManager.getLocation();

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
			getRandomlineList: function() {
				return $http.get(serverUrl + 'getRandomlineList')
					.then(function(response) {
						if (response.data) {
							if (myLocation) {
								response.data = orderLineList(myLocation, response.data);
							}
							defaultLines = response.data;
							console.log("randomlineList: ", defaultLines);
							return defaultLines;
						}

					});
			},
			getDefaultLineList: function() {
				return defaultLines;
			},
			getLine: function(lineId) {
				return $http.get(serverUrl + 'getLine', {
					params: {
						lineId: lineId,
						userId: $userManagment.getMyId()
					},
					timeout: 8000
				}).then(function(response) {
					console.log("line got from server:", response.data);
					if (response.data) {
						if (response.data != "noRoom" || response.data != "signedIn") {
							lineInfo = response.data;
							return response.data;
						} else {
							return response.data;
						}
					}
					return false;
				}, function() {
					return false;
				});

			},
			searchLineByName: function(value) {
				return $http.get(serverUrl + 'searchLineList', {
					params: {
						value: value
					}
				}).then(function(response) {
					if (response.data) {
						if (myLocation) {
							response.data = orderLineList(myLocation, response.data)
						}
						return response.data;
					} else return [];
				}, function() {
					return [];
				});
			},
			getLineInfo: function() {
				return lineInfo;
			}
		}
	});

	$provide.factory('$meetingManager', function($rootScope, $http, $userManagment, $localstorage) {

		var currentMeeting;

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

		return {
			joinLine: function(lineInfo) {

				currentMeeting = lineInfo;
				return $http.get(serverUrl + 'joinLine', {
					params: {
						lineId: currentMeeting.lineId,
						userId: $userManagment.getMyId(),
						userName: $userManagment.getMyName()
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data) {
						if (response.data == "noRoom" || response.data == "userSignedIn") {
							return response.data;
						}
						currentMeeting = response.data;
						currentMeeting.ProgressCounter = false;
						currentMeeting.progressWidth = 0;
						calculateTimeLeft();
						var save = {
							lineId: currentMeeting.lineId,
							title: currentMeeting.title,
							time: currentMeeting.time
						};
						return save;
					}
					return false;

				}, function() {
					return false;
				});
			},
			getCurrentMeeting: function() {
				if (!currentMeeting) return;
				return currentMeeting;
			},
			setCurrent: function(id) {
				return $http.get(serverUrl + 'getMeetingInfo', {
					params: {
						lineId: id,
						userId: $userManagment.getMyId()
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data) {
						currentMeeting = response.data;
						currentMeeting.ProgressCounter = false;
						currentMeeting.progressWidth = 0;
						calculateTimeLeft();
						console.log("meeting update:", currentMeeting);
						return true;
					} else return false;
				}, function() {
					return false;
				});
			},
			cancelMeeting: function(meeting) {

				return $http.get(serverUrl + 'cancelMeeting', {
					params: {
						lineId: meeting.lineId,
						userId: $userManagment.getMyId(),
						time: meeting.time,
						userName: $userManagment.getMyName()
					},
					timeout: 8000
				}).then(function(response) {

					if (response.data) {
						return true;
					}
					return false;
				}, function() {
					return false;
				});
			},
			confirmMeeting: function() {
				if (!currentMeeting) return;

				return $http.get(serverUrl + 'confirmMeeting', {
					params: {
						lineId: currentMeeting.lineId,
						userId: $userManagment.getMyId(),
						userName: $userManagment.getMyName()
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data) {
						currentMeeting.confirmed = response.data;
						return true;
					}
					return false;
				}, function() {
					return false;
				});

			}
		}
	});

	$provide.factory('$lineManager', function($rootScope, $http, $userManagment, $localstorage) {
		var currentLine = {};


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
					$rootScope.$broadcast('lineInfoUpdated', true);
				} else {
					$rootScope.$broadcast('lineInfoUpdated', false);
				}
			}, function(response) {
				$rootScope.$broadcast('lineInfoUpdated', false);
			});

		}

		return {
			getCurrentLine: function() {
				if (currentLine) return currentLine;

			},
			createLine: function(line) {
				line.lineManagerId = $userManagment.getMyId();
				return $http.get(serverUrl + 'createLine', {
					params: {
						line: line
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data) {
						currentLine.lineId = response.data;
						getLineInfo();
						return response.data;
					} else {
						return false;
					}
				}, function(response) {
					return false;
				});

			},
			setCurrent: function(lineId) {
				return $http.get(serverUrl + 'getLineInfo', {
					params: {
						lineId: lineId,
						lineManagerId: $userManagment.getMyId()
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data) {
						currentLine = response.data;
						console.log("setCurrent: ", currentLine);
						return true;
					} else {
						return false;
					}
				}, function(response) {
					return false;
				});

			},
			endLine: function() {

				return $http.get(serverUrl + 'endLine', {
					params: {
						lineId: currentLine.lineId,
						lineManagerId: $userManagment.getMyId()
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data) {
						//TODO move line to passed lines
						return true;
					} else {
						return false;
					}
				}, function() {
					return false;
				});

			},
			postponeLine: function(delayTime) {
				
				return $http.get(serverUrl + 'postponeLine', {
					params: {
						lineId: currentLine.lineId,
						lineManagerId: $userManagment.getMyId(),
						time: delayTime
					},
					timeout: 8000
				}).then(function(response) {

					if (response.data) {
						getLineInfo();
						return true;
					} else {
						return false;
					}
				}, function(response) {
					return false;
				});
			},
			nextMeeting: function() {
				return $http.get(serverUrl + 'nextMeeting', {
					params: {
						lineId: currentLine.lineId,
						lineManagerId: $userManagment.getMyId()
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data) {
						getLineInfo();
						return true;
					} else {
						return false;
					}
				}, function(response) {
					return false;
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

				switch (notification.payload.type) {
					case "endLine":
						$cordovaDialogs.alert("Line: " + notification.payload.title + " canceld");
						$rootScope.$broadcast("endLine", notification.payload.lineId);
						break;
					case "endMeeting":
						$cordovaDialogs.alert("thanks u form: " + notification.payload.title);
						$rootScope.$broadcast("endMeeting", notification.payload.lineId);
						break;
					case "postponeLine":
						$cordovaDialogs.alert("Line: " + notification.payload.title + " postpone new time:" + notification.payload.usersNewTime);
						break;
					case "lineShorted":
						$cordovaDialogs.alert("Line: " + notification.payload.title + " shorted new time:" + notification.payload.usersNewTime);
						break;
					case "newTime":
						$cordovaDialogs.alert("Line: " + notification.payload.title + " updated time:" + notification.payload.usersNewTime);
						break;
					case "nextInLine":
						$cordovaDialogs.alert("your are nexy in line: " + notification.payload.title);
						break;
					case "enterLine":
						$cordovaDialogs.alert("please enter to line: " + notification.payload.title);
						break;
					case "lineWillBegin":
						$cordovaDialogs.alert("line: " + notification.payload.title + " will begin in"+notification.payload.time);
						break;
					case "lineWillBeginIn5":
						$cordovaDialogs.alert("line: " + notification.payload.title + " will begin in 5 minutes");
						break;
					case "lineStart":
						$cordovaDialogs.alert("line: " + notification.payload.title + " started next user:"+ notification.payload.username);
						break;
					case "lineStartNoUsers":
						$cordovaDialogs.alert("line: " + notification.payload.title + " started but no one signed in :(");
						break;
					case "userCanceldMeeting":
						$cordovaDialogs.alert(notification.payload.userName + " canceled meeting in line" + notification.payload.title);
						break;
					case "userCanceldMeeting":
						$cordovaDialogs.alert(notification.payload.userName + " canceled meeting in line" + notification.payload.title);
						break;
					case "meetingConfirmed":
						$cordovaDialogs.alert(notification.payload.userName + " confirmed line:" + notification.payload.title);
						break;
					case "newUser":
						$cordovaDialogs.alert(notification.payload.userName + " joined Line: " + notification.payload.title);
						break;
					case "askConfirmed":
						$cordovaDialogs.alert("please confirmed: " + notification.payload.title + "that will start at: "+notification.payload.usersNewTime);
						break;
					case "noConfirmation":
						$cordovaDialogs.alert("u didnt confirm meeting: " + notification.payload.title + " meetings canceld");
						$rootScope.$broadcast("endMeeting", notification.payload.lineId);
						break;

					default:
						$cordovaDialogs.alert("you got a defualt message!", "LineUp informs you that:");
				}

			} else if (notification.event == "error")
				$cordovaDialogs.alert(notification.msg, "Push notification error event");
			else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
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