angular.module('starter.services', ['ngCordova']).config(['$provide', function($provide) {

	$provide.factory('$phoneManager', function($rootScope, $state) {

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
		var username = "";
		var pushToken = false;
		var userToken = false;
		var connected = false;


		ionic.Platform.ready(function() {
			var device = ionic.Platform.device();
			if (!device.uuid) deviceId = "browser";
			else deviceId = device.uuid;
		});


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
			getMyToken: function() {
				if (userToken)
					return userToken;
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
							username = user.username;
							userId = response.data.user._id;
							userToken = response.data.user.userToken;
							delete response.data.user.userToken;
							delete response.data.user._id;

							response.data.user.username = user.username;
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
							username = user.username;
							userId = response.data.user._id;
							userToken = response.data.user.userToken;
							
							$localstorage.setObject('lineup', {
								username: user.username,
								password: user.password
							});
							if (pushToken) {
								sendTokenToServer(pushToken);
							}
							console.log("user login :", username);
						
							user = {username: user.username};
							return user;
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
				userToken= "";
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
				return $http.get(serverUrl + 'getRandomlineList', {
					params: {
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken()
					},
					timeout: 8000
				})
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
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken()
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
						value: value,
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken()
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
			var delta = (time - now) / 1000;
			currentMeeting.timeLeft = {};
		
			currentMeeting.timeLeft.days = Math.floor(delta / 86400);
			delta -= currentMeeting.timeLeft.days * 86400;
			currentMeeting.timeLeft.hours = Math.floor(delta / 3600) % 24;
			delta -= currentMeeting.timeLeft.hours * 3600;
			currentMeeting.timeLeft.minutes = Math.floor(delta / 60) % 60;

		
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
						userToken: $userManagment.getMyToken(),
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
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken()
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
						userToken: $userManagment.getMyToken(),
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
						userToken: $userManagment.getMyToken(),
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

			},
			followMeeting :function (lineId , userIdToFollow) {
					return $http.get(serverUrl + 'followMeeting', {
					params: {
						lineId: currentMeeting.lineId,
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken(),
						FollowId: userIdToFollow,
						myName: $userManagment.getMyName()

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

			}
		}
	});

	$provide.factory('$lineManager', function($rootScope, $http, $userManagment, $localstorage) {
		var currentLine = {};


		function getLineInfo() {
			return $http.get(serverUrl + 'getLineInfo', {
				params: {
					lineId: currentLine.lineId,
					userId: $userManagment.getMyId(),
					userToken: $userManagment.getMyToken()
				},
				timeout: 8000
			}).then(function(response) {
				if (response.data) {

					currentLine = response.data;
					return currentLine;
					// console.log("getLineInfo: ", currentLine);
					// $rootScope.$broadcast('lineInfoUpdated', true);
				} else {
					return false;
					$rootScope.$broadcast('lineInfoUpdated', false);
				}
			}, function(response) {
				return false;
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
						line: line,
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken()
					},
					timeout: 8000
				}).then(function(response) {
					
					if (response.data) {
						currentLine.lineId = response.data;
						return getLineInfo().then(function(data){
							if (data) {
								return data;		
							}
							else return false;
						});
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
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken()
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
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken()
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
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken(),
						time: delayTime
					},
					timeout: 8000
				}).then(function(response) {

					if (response.data) {
						getLineInfo().then(function(data){
							if (data) {
								return data;		
							}
							else return false;
						});
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
						userId: $userManagment.getMyId(),
						userToken: $userManagment.getMyToken()
					},
					timeout: 8000
				}).then(function(response) {
					if (response.data == "noMoreMeetingsLineClosed" || response.data == "noMoreMeetingsAskWhatToDo" || response.data == "lineDidntStart");
					return response.data;
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

	$provide.factory('$pushNotificationHere', function($rootScope, $http, $cordovaDialogs, $userManagment, $meetingManager, $lineManager, $state, $ionicPopup, $ionicLoading, $outSideLineHandler) {

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

			if (notification.event == "registered") {

				console.log("registered to notification:", notification.regid);
				sendTokenToServer(notification.regid);

			} else if (notification.event == "message") {


				switch (notification.payload.type) {
					case "line":
						var popup = $ionicPopup.show({
							template: notification.message,
							title: 'LineUp',
							buttons: [{
								text: 'thanks',
								onTap: function(e) {
									return false;
								}
							}, {
								text: '<b>go to Line</b>',
								type: 'button-positive',
								onTap: function(e) {
									return true;
								}

							}]
						});
						popup.then(function(data) {
							if (data) {
								$ionicLoading.show();
								$lineManager.setCurrent(notification.payload.lineId).then(function(data) {
									$ionicLoading.hide();
									if (data) {
										$state.go("app.lineStatus");
									} else {}

								});
							}
						});
						break;
					case "meeting":
						var popup = $ionicPopup.show({
							template: notification.message,
							title: 'LineUp',
							buttons: [{
								text: 'thanks',
								onTap: function(e) {
									return false;
								}
							}, {
								text: '<b>go to Meeting</b>',
								type: 'button-positive',
								onTap: function(e) {
									return true;
								}

							}]
						});
						popup.then(function(data) {
							if (data) {
								$ionicLoading.show();
								$meetingManager.setCurrent(notification.payload.lineId).then(function(data) {
									$ionicLoading.hide();
									if (data) {
										$state.go("app.meetingStatus");
									} else {}

								});
							}
						});

						break;
					case "remove":
						var alertPopup = $ionicPopup.alert({
							title: "LineUp",
							template: notification.message
						});
						$rootScope.$broadcast("endMeeting", notification.payload.lineId);
						break;
					default:

				}

			} else console.log("err in notification:", notification.event + ", message:", notification.msg)
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

		window.handleOpenURL = function(url) {

			console.log("received url: " + url);
			if (url) {
				var param = url.split("//");

				if (param[1]) {
					//meeting shared
					if (param[1].indexOf("&&") > -1) {
						var params = param[1].split("&&");
						var id = params[0];
						var userId = params[1];
						$meetingManager.followMeeting(id , userId);

						
					}
					else {
						var id = param[1]; 
						$ionicLoading.show();
						$outSideLineHandler.getLine(id).then(function(data) {
								$ionicLoading.hide();
								if (!data) {
									var alertPopup = $ionicPopup.alert({
										title: "error",
										template: "error"
									});
								} else if (data == "noSuchLine") {
									var alertPopup = $ionicPopup.alert({
										title: "no such line",
										template: "no such line"
									});
								} else if (data == "noRoom") {
									var alertPopup = $ionicPopup.alert({
										title: "no room in line",
										template: "no room in line"
									});
								} else if (data == "userSignedIn") {
									var alertPopup = $ionicPopup.alert({
										title: "already signed to this line",
										template: "already signed to this line"
									});
									$meetingManager.setCurrent(id).then(function(data) {
										if (!data) {
											var alertPopup = $ionicPopup.alert({
												title: "errr",
												template: "err"
											});
										} else {
											$state.go("app.meetingStatus");
										}
									});

								} else {
									$state.transitionTo("app.getInLine");
								}

							});


					}
					
				}

			}
		}

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