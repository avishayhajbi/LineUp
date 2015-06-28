angular.module('starter.controllers', ['ngCordova'])

.controller('menuCtrl', function($scope, $ionicModal, $localstorage, $ionicModal, $timeout, $filter, $userManagment, $ionicLoading, $ionicPopup, $state, $pushNotificationHere) {

		$scope.user = {};
		$scope.user.activeLines = [];
		$scope.user.passedLines = [];
		$scope.user.activeMeetings = [];
		$scope.user.passedMeetings = [];

		//SIGN on start up 
		//$localstorage.setObject('lineup', '');
		var connect = $localstorage.getObject('lineup');
		if (connect.username && connect.password) {
			$userManagment.loginWithEmail(connect).then(function(data) {
				if (data) {
					$scope.user = data;
					console.log("user data:", $scope.user);
				} else {
					var alertPopup = $ionicPopup.alert({
						title: "LineUp",
						template: "worng password or user name"
					});

				}
			});
		}

		//log in 
		$scope.loginData = {};
		$ionicModal.fromTemplateUrl('templates/ionicModal/login.html', {
			scope: $scope
		}).then(function(login) {
			$scope.loginMenu = login;
		});

		$scope.doLogin = function() {
			//TODO to valid in html valid user

			if (!$scope.loginData.password || !$scope.loginData.username) {
				//TODO pop up alert missing params
			} else {
				$userManagment.loginWithEmail($scope.loginData).then(function(data) {

					if (!data) {
						var alertPopup = $ionicPopup.alert({
							title: "LineUp",
							template: "worng password or user name"
						});
					} else {
						//TODO pop up welcome back
						$scope.user = data;
						console.log("user data:", $scope.user);
						$scope.loginMenu.hide();
						$state.go("app.default");
					}

				});
			}
		};

		//signup
		$scope.signUpData = {};
		$ionicModal.fromTemplateUrl('templates/ionicModal/signup.html', {
			scope: $scope
		}).then(function(signup) {
			$scope.signupMenu = signup;
		});
		$scope.dosignUp = function() {
			//TODO to valid in html valid user
			if (!$scope.signUpData.email || !$scope.signUpData.password || !$scope.signUpData.username || !$scope.signUpData.repetPassword) {
				var alertPopup = $ionicPopup.alert({
					title: $filter('translate')('TR_POPTITLE'),
					template: $filter('translate')('Missing parameters')

				});
			} else {
				var email = $scope.signUpData.email;
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

				if (!filter.test(email)) {
					var alertPopup = $ionicPopup.alert({
						title: $filter('translate')('TR_POPTITLE'),
						template: $filter('translate')(email + 'is not a valid email address')
					});

				} else if ($scope.signUpData.repetPassword != $scope.signUpData.password) {
					var alertPopup = $ionicPopup.alert({
						title: $filter('translate')('TR_POPTITLE'),
						template: $filter('translate')('Passwords do not match')
					});

				} else {
					$userManagment.signUpWithEmail($scope.signUpData).then(function(data) {

						if (data == "userExist") {
							var alertPopup = $ionicPopup.alert({
								title: "LineUp",
								template: "user exist"
							});
						} else if (!data) {
							//TODO popup to tell what went worng
						} else {
							console.log("user data:", $scope.user);
							$scope.user = data;
							$scope.user.activeLines = [];
							$scope.user.passedLines = [];
							$scope.user.activeMeetings = [];
							$scope.user.passedMeetings = [];

							//TODO pop up signed in 
							$scope.signupMenu.hide();
						}
					});
				}
			}
		};

		$scope.openLogin = function() {
			$scope.loginMenu.show();
		};

		// Triggered in the login modal to close it
		$scope.closeLogin = function() {
			$scope.loginMenu.hide();
		};



		$scope.openSignup = function() {
			$scope.signupMenu.show();
		};


		$scope.closeSignup = function() {
			$scope.signupMenu.hide();
		};

		// Open the login modal
		$scope.signup = function() {
			$scope.signupMenu.show();
		};

		$scope.logOut = function() {
			$userManagment.logOut()
			$scope.user = {};

		};


		$scope.signInFackBook = function() {
			$userManagment.connectToFaceBook();
		};
		// $scope.$on('connectedToFB', function(event, result) {
		//     $scope.user = {
		//         id: $userManagment.getfbId(),
		//         name: $userManagment.getMyName(),
		//         connected: $userManagment.isConnected()
		//     };
		// });

		$scope.$on("endLine", function(evt, lineId) {
			removeFromActiveLines(lineId);
		});
		$scope.$on("endMeeting", function(evt, lineId) {
			removeFromActiveMeetings(lineId);
		});

		function removeFromActiveLines(lineId) {
			for (var i = 0; i < $scope.user.activeLines.length; i++) {
				if ($scope.user.activeLines[i].lineId == lineId) {
					$scope.user.passedLines.push($scope.user.activeLines[i]);
					$scope.user.activeLines.splice(i, 1);
					break;
				}

			}
		}

		function removeFromActiveMeetings(lineId) {
			for (var i = 0; i < $scope.user.activeMeetings.length; i++) {
				if ($scope.user.activeMeetings[i].lineId == lineId) {
					$scope.user.passedMeetings.push($scope.user.activeMeetings[i]);
					$scope.user.activeMeetings.splice(i, 1);
					break;
				}
			}
		}

	})
	.controller('defaultCtrl', function($scope, $ionicModal, $ionicPopup, $state, $ionicScrollDelegate, $filter, $outSideLineHandler, $ionicLoading, $lineManager, $meetingManager, $userManagment) {


		$scope.createLine = function() {

			$state.go("app.createLine");
		}

		$scope.chooseLineNew = function(id) {
			$ionicLoading.show({
				template: $filter('translate')('TR_Loading')
			});
			$lineManager.setCurrent(id).then(function(data) {
				$ionicLoading.hide();
				if (data) {
					$state.go("app.lineStatus");
				} else {
					//TODO pop up can load line
				}

			});

		}

		$scope.chooseMeeting = function(id) {
			$ionicLoading.show({
				template: $filter('translate')('TR_Loading')
			});
			$meetingManager.setCurrent(id).then(function(data) {
				$ionicLoading.hide();
				if (data) {
					$state.go("app.meetingStatus");
				} else {
					//TODO pop up can load line
				}

			});

		}

		$scope.lineIdToGet = '';
		$scope.placeholder = 'TR_ENTERLINEID';
		$scope.searchPlaceHolder = 'TR_SEARCH';



		//when typing on inputbox
		$scope.changeInput = function(manualId) {
			$scope.lineIdToGet = manualId;
		}

		// clear the placeholder when click
		$scope.clearPlaceHolder = function() {
			$scope.placeholder = '';
			$scope.lineIdToGet = '';
		}

		$ionicModal.fromTemplateUrl('templates/ionicModal/LineList.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		//open the list of lines
		$scope.openChooseLine = function() {
				$scope.LineList = $outSideLineHandler.getDefaultLineList();
				$scope.modal.show();

			}
			//when click back
		$scope.closeChooseLine = function() {
				$scope.lineIdToGet = '';
				$scope.modal.hide();
			}
			//click on one Line
		$scope.chooseLine = function(line) {
			$scope.placeholder = line.title;
			$scope.lineIdToGet = line._id;
			$scope.modal.hide();
		}

		//iside  chooseLine function : 
		$scope.scrollToTop = function() {

		}

		$scope.searchLineByName = function(value) {
			console.log("search Value:" + value);
			if (value !== '') {
				$outSideLineHandler.searchLineByName(value).then(function(data) {
					$scope.LineList = data;
				});
			}
		}
		$scope.resetSearchBar = function(value) {
			$ionicScrollDelegate.scrollTop();
			if (value === '') {
				$scope.LineList = $outSideLineHandler.getDefaultLineList();
			}
		}


		$scope.getLine = function() {
			$ionicLoading.show({
				template: $filter('translate')('TR_Loading')
			});
			$outSideLineHandler.getLine($scope.lineIdToGet).then(function(data) {
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
					$meetingManager.setCurrent($scope.lineIdToGet).then(function(data) {
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



	})
	.controller('createLineCtrl', function($scope, $filter, $state, $ionicPopup, $ionicLoading, $lineManager) {

		$scope.newLine = {};
		$scope.newLine.location = {
			latitude: '',
			longitude: ''
		};


		var autocomplete;
		(function() {
			autocomplete = new google.maps.places.Autocomplete(
				(document.getElementById('autocomplete')), {
					types: ['geocode']
				});
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				var place = autocomplete.getPlace();
				$scope.newLine.location.latitude = place.geometry.location.k;
				$scope.newLine.location.longitude = place.geometry.location.D;
				$scope.newLine.location.address = place.formatted_address;

			});
		})();

		//image handeling
		// $scope.PicSourece = document.getElementById('smallimage');

		// function UploadPicture(imageURI) {
		//     if (imageURI.substring(0, 21) == "content://com.android") {
		//         var photo_split = imageURI.split("%3A");
		//         imageURI = "content://media/external/images/media/" + photo_split[1];
		//     }
		//     $scope.newLine.ImageURI = imageURI;
		//     $scope.PicSourece.src = imageURI;

		// }
		// $scope.ShowPictures = function() {
		//     navigator.camera.getPicture(UploadPicture, function(message) {
		//         console.log('get picture failed');
		//     }, {
		//         quality: 100,
		//         destinationType: navigator.camera.DestinationType.FILE_URI,
		//         sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
		//     });
		// };



		$scope.createLine = function() {
			var validStartDate = 0;
			var validEndDate = 0;
			var currentDate = new Date();
			if (!checkAtt($scope.newLine.confirmTime) || !checkAtt($scope.newLine.druation) || !$scope.newLine.startDate || !$scope.newLine.endDate || !$scope.newLine.day) {
				var alertPopup = $ionicPopup.alert({
					title: 'missing information',
					template: 'please fill all information'
				});
			} else {
				$scope.newLine.startDate.setDate($scope.newLine.day.getDate());
				$scope.newLine.startDate.setMonth($scope.newLine.day.getMonth());
				$scope.newLine.startDate.setFullYear($scope.newLine.day.getFullYear());
				$scope.newLine.endDate.setDate($scope.newLine.day.getDate());
				$scope.newLine.endDate.setMonth($scope.newLine.day.getMonth());
				$scope.newLine.endDate.setFullYear($scope.newLine.day.getFullYear());
			}

			if (currentDate > $scope.newLine.startDate) {
				var alertPopup = $ionicPopup.alert({
					title: 'Date problem',
					template: 'Line Start time past..'
				});
			} else {
				validStartDate = 1;
			}

			if ($scope.newLine.startDate >= $scope.newLine.endDate) {
				var alertPopup = $ionicPopup.alert({
					title: 'Date problem',
					template: 'Line end time must be greater than Line start time'
				});
			} else {
				validEndDate = 1;
			}

			if (validStartDate == 1 && validEndDate == 1) {
				var newLine = $scope.newLine;
				newLine.active = false;

				$ionicLoading.show({
					template: $filter('translate')('TR_Loading')
				});


				$lineManager.createLine(newLine).then(function(data) {
					debugger;
					$ionicLoading.hide();
					if (!data) {
						var alertPopup = $ionicPopup.alert({
							title: $filter('translate')('TR_POPTITLE'),
							template: $filter('translate')('TR_POPTEMPLATE')
						});
					} else {
						$scope.user.activeLines.push({
							lineId: data.lineId,
							title: $scope.newLine.title
						});
						$state.go("app.lineStatus");
					}
				});

			}
		}


	})


.controller('shareLineCtrl', function($scope, $lineManager, $cordovaSocialSharing, $state) {

	$scope.line = $lineManager.getCurrentLine();
	if (!$scope.line) {
		$scope.line = {};
		$scope.line.link = "link not avilable";
	} else {
		$scope.line.link = "https://lineupserver.herokuapp.com/lineRedirect?lineId=" + $scope.line.lineId;
	}

	$scope.copyLineLink = function() {
		cordova.plugins.clipboard.copy($scope.line.link);
	};

	$scope.shareFackBook = function() {
		console.log("share via FaceBook");
		facebookConnectPlugin.showDialog({
			method: 'share',
			href: $scope.line.link,
		}, function(data) {
			console.log(data);
		}, function(data) {
			console.log(data);
		});
		//$cordovaSocialSharing.shareViaFacebook( "hi check my Line", false, $scope.line.link);
	};

	$scope.shareMobile = function() {
		console.log("share via Mobile");
		$cordovaSocialSharing.share("LineUp", "hi check my Line", false, $scope.line.link);
	};

	$scope.LineStatus = function() {
		$state.go("app.lineStatus");
	};

})

.controller('lineStatusCtrl', function($scope, $state, $lineManager, $ionicLoading, $ionicPopup, $filter) {

	$scope.line = $lineManager.getCurrentLine();

	$scope.$on("lineInfoUpdated", function() {
		$scope.line = $lineManager.getCurrentLine();
	});

	$scope.shareLine = function() {
		$state.go("app.shareLine");
	};

	$scope.analyzeLine = function() {
		$state.go("app.lineAnalyze");
	};

	$scope.LineStatus = function() {
		$state.go("app.lineStatus");
	};
	$scope.nextMeeting = function() {
		$ionicLoading.show();
		$lineManager.nextMeeting().then(function(data) {
			$ionicLoading.hide();

			if (data == "noMoreMeetingsLineClosed") {
				var alertPopup = $ionicPopup.alert({
					title: "No more meetings and room for meetings closing line",
					template: "No more meetings and room for meetings closing line"
				});
				for (var i = 0; i < $scope.user.activeLines.length; i++) {
					if ($scope.user.activeLines[i].lineId == $scope.line.lineId) {
						$scope.user.passedLines.push($scope.user.activeLines[i]);
						$scope.user.activeLines.splice(i, 1);
						break;
					}
				}
				console.log("End line");
				$state.go("app.lineAnalyze");
			} else if (data == "lineDidntStart") {
				var alertPopup = $ionicPopup.alert({
					title: "Line didn't start yet",
					template: "Line didn't start yet"
				});
				console.log("Move to next Meeting");

			} else if (data == "noMoreMeetingsAskWhatToDo") {

				var chooseDatePopUp = $ionicPopup.show({
					template: 'No more meetings in line what do do?',
					title: 'No more meetings in line what do do?',
					subTitle: '',
					scope: $scope,
					buttons: [{
						text: 'leave open',
					}, {
						text: 'end line',
						type: 'button-positive',
						onTap: function(e) {
							$ionicLoading.show();

							$lineManager.endLine().then(function(data) {
								$ionicLoading.hide();
								if (!data) {
									var alertPopup = $ionicPopup.alert({
										title: $filter('translate')('TR_POPTITLE'),
										template: $filter('translate')('TR_POPTEMPLATE')
									});
								} else {
									for (var i = 0; i < $scope.user.activeLines.length; i++) {
										if ($scope.user.activeLines[i].lineId == $scope.line.lineId) {
											$scope.user.passedLines.push($scope.user.activeLines[i]);
											$scope.user.activeLines.splice(i, 1);
											break;
										}
									}
									console.log("End line");
									$state.go("app.lineAnalyze");
								}

							});

						}
					}]
				});



			} else if (!data) {
				$scope.line = data;
				var alertPopup = $ionicPopup.alert({
					title: $filter('translate')('TR_POPTITLE'),
					template: $filter('translate')('TR_POPTEMPLATE')
				});
				console.log("Move to next Meeting");
			}

		});

	};


	$scope.postponeLine = function() {

		$scope.data = {};
		var chooseDatePopUp = $ionicPopup.show({
			template: '<label class="item item-input row row-center"><input type="number" class="col col-75" ng-model="data.delayTime"></label>',
			title: 'Postpose Line:',
			subTitle: '',
			scope: $scope,
			buttons: [{
				text: 'Cancel'
			}, {
				text: '<b>OK</b>',
				type: 'button-positive',
				onTap: function(e) {

					$scope.data.delayTime = parseInt($scope.data.delayTime);

					$ionicLoading.show();

					$lineManager.postponeLine($scope.data.delayTime).then(function(data) {

						$ionicLoading.hide();
						if (!data) {
							var alertPopup = $ionicPopup.alert({
								title: $filter('translate')('TR_POPTITLE'),
								template: $filter('translate')('TR_POPTEMPLATE')
							});

						} else {
							$scope.line = data;
							var alertPopup = $ionicPopup.alert({
								title: "Line postponed",
								template: "Line postponed in: " + $scope.data.delayTime + " minutes"
							});

						}

					});



				}
			}]
		});
	};

	// $scope.sendMessage = function() {
	//     console.log("Send message");
	//     $scope.modalMessageMenu.show();
	// };

	$scope.endLine = function() {

		var popup = $ionicPopup.show({
			template: "are u sure?",
			title: 'LineUp',
			buttons: [{
				text: 'no',
				onTap: function(e) {
					return false;
				}
			}, {
				text: '<b>yes</b>',
				type: 'button-positive',
				onTap: function(e) {
					return true;
				}

			}]
		});
		popup.then(function(data) {
			if (data) {
				$lineManager.endLine().then(function(data) {
					$ionicLoading.hide();
					if (!data) {
						var alertPopup = $ionicPopup.alert({
							title: $filter('translate')('TR_POPTITLE'),
							template: $filter('translate')('TR_POPTEMPLATE')
						});
					} else {
						for (var i = 0; i < $scope.user.activeLines.length; i++) {
							if ($scope.user.activeLines[i].lineId == $scope.line.lineId) {
								$scope.user.passedLines.push($scope.user.activeLines[i]);
								$scope.user.activeLines.splice(i, 1);
								break;
							}
						}
						console.log("End line");
						$state.go("app.lineAnalyze");
					}

				});

			}
		});

	};
})

.controller('myLinesCtrl', function($scope, $lineManager, $state, $userManagment, $ionicLoading, $filter) {

	$scope.chooseLineNew = function(id) {
		$ionicLoading.show({
			template: $filter('translate')('TR_Loading')
		});
		$lineManager.setCurrent(id).then(function(data) {
			$ionicLoading.hide();
			if (data) {
				$state.go("app.lineStatus");
			} else {
				//TODO pop up can load line
			}

		});

	}

	$scope.createLine = function() {
		$state.go("app.createLine");
	}

})

.controller('getInLineCtrl', function($scope, $state, $meetingManager, $outSideLineHandler, $ionicLoading, $filter, $ionicPopup) {

	$scope.meeting = $outSideLineHandler.getLineInfo();

	$scope.joinLine = function() {

		$ionicLoading.show({
			template: $filter('translate')('TR_Loading')
		});
		$meetingManager.joinLine($scope.meeting).then(function(data) {

			$ionicLoading.hide();

			if (!data) {
				var alertPopup = $ionicPopup.alert({
					title: $filter('translate')('TR_POPTITLE'),
					template: $filter('translate')('TR_POPTEMPLATE')
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
				$meetingManager.setCurrent($scope.lineIdToGet);
				$state.go("app.meetingStatus");
			} else {
				$scope.user.activeMeetings.push(data);
				$state.go("app.meetingStatus");
			}
		});
	}

})

.controller('shareMeetingCtrl', function($scope, $meetingManager, $cordovaSocialSharing, $state, $userManagment) {

		$scope.meeting = $meetingManager.getCurrentMeeting();

		if (!$scope.meeting) {
			$scope.meeting = {};
			$scope.meeting.link = "link not avilable";
			$scope.meeting.link2 = "link not avilable";
		} else {
			$scope.meeting.link = "https://lineupserver.herokuapp.com/meetingRedirect?meetingId=" + $scope.meeting.lineId;
			$scope.meeting.link2 = "https://lineupserver.herokuapp.com/lineRedirect?lineId=" + $scope.meeting.lineId + "&userId=" + $userManagment.getMyId();
		}

		$scope.copyLink = function(link) {
			cordova.plugins.clipboard.copy(link);
		};

		$scope.shareFackBook = function(link) {
			console.log("share via FaceBook");
			facebookConnectPlugin.showDialog({
				method: 'share',
				href: link,
			}, function(data) {
				console.log(data);
			}, function(data) {
				console.log(data);
			});
			//$cordovaSocialSharing.shareViaFacebook( "hi check my Line", false, $scope.line.link);
		};

		$scope.shareMobile = function(link) {
			console.log("share via Mobile");
			$cordovaSocialSharing.share("LineUp", "hi check my Line", false, link);
		};

		$scope.MeetingStatus = function() {
			$state.go("app.meetingStatus");
		};

		$scope.cancelMeeting = function() {
			var cancelLinePopUp = $ionicPopup.show({
				template: 'are u sure?',
				title: 'alert',
				subTitle: '',
				scope: $scope,
				buttons: [{
					text: 'No'
				}, {
					text: '<b>Yes</b>',
					type: 'button-positive',
					onTap: function(e) {
						$ionicLoading.show({
							template: $filter('translate')('TR_Loading')
						});

						$meetingManager.cancelMeeting($scope.meeting).then(function(data) {
							$ionicLoading.hide();
							if (!data) {
								var alertPopup = $ionicPopup.alert({
									title: "please try again",
									template: "please try again"
								});
							} else {


								var canceledPopup = $ionicPopup.show({
									template: 'Meeting canceled',
									title: 'Meeting canceled',
									subTitle: '',
									scope: $scope,
									buttons: [{
										text: '<b>ok</b>',
										type: 'button-positive',
										onTap: function(e) {
											return;
										}

									}]
								});
								canceledPopup.then(function(data) {

									for (var i = 0; i < $scope.user.activeMeetings.length; i++) {
										if ($scope.user.activeMeetings[i].lineId == $scope.meeting.lineId) {
											$scope.user.passedMeetings.push($scope.user.activeMeetings[i]);
											$scope.user.activeMeetings.splice(i, 1);
											break;
										}
									}
									$scope.meeting = {};
									$state.go("app.default");
								});
							}
						});
					}
				}]
			});
		}


	})
	.controller('meetingStatusCtrl', function($scope, $meetingManager, $ionicPopup, $ionicLoading, $filter, $state, $timeout) {

		$scope.meeting = $meetingManager.getCurrentMeeting();
		$scope.reminder = true;

		$scope.cancelMeeting = function() {
			var cancelLinePopUp = $ionicPopup.show({
				template: 'Are u sure?',
				title: 'Alert',
				subTitle: '',
				scope: $scope,
				buttons: [{
					text: 'No'
				}, {
					text: '<b>Yes</b>',
					type: 'button-positive',
					onTap: function(e) {
						$ionicLoading.show({
							template: $filter('translate')('TR_Loading')
						});
						if ($scope.meeting) {
							$meetingManager.cancelMeeting($scope.meeting).then(function(data) {
								$ionicLoading.hide();
								if (!data) {
									var alertPopup = $ionicPopup.alert({
										title: "Please try again",
										template: "Please try again"
									});
								} else {
									var canceledPopup = $ionicPopup.show({
										template: 'Meeting canceled',
										title: 'Meeting canceled',
										subTitle: '',
										scope: $scope,
										buttons: [{
											text: '<b>ok</b>',
											type: 'button-positive',
											onTap: function(e) {
												return;
											}

										}]
									});
									canceledPopup.then(function(data) {
										for (var i = 0; i < $scope.user.activeMeetings.length; i++) {
											if ($scope.user.activeMeetings[i].lineId == $scope.meeting.lineId) {
												$scope.user.passedMeetings.push($scope.user.activeMeetings[i]);
												$scope.user.activeMeetings.splice(i, 1);
												break;
											}
										}
										$scope.meeting = {};
										$state.go("app.default");
									});
								}
							});
						}
					}
				}]
			});
		}

		$scope.shareMeeting = function() {
			$state.go("app.shareMeeting");
		};
		$scope.confirmMeeting = function() {

			$meetingManager.confirmMeeting().then(function(data) {
				if (data) {
					var alertPopup = $ionicPopup.alert({
						title: "Meeting confirmed",
						template: "Meeting confirmed"
					});

				} else {
					var alertPopup = $ionicPopup.alert({
						title: "Problem please try again",
						template: "Problem please try again"
					});
				}
			});
		};

	})
	.controller('myMeetingsCtrl', function($scope, $ionicModal, $ionicPopup, $state, $ionicScrollDelegate, $filter, $outSideLineHandler, $ionicLoading, $lineManager, $meetingManager, $userManagment) {

		$outSideLineHandler.getRandomlineList().then(function(data) {
			$scope.LineList = data;
		});


		$scope.chooseMeeting = function(id) {
			$ionicLoading.show({
				template: $filter('translate')('TR_Loading')
			});
			$meetingManager.setCurrent(id).then(function(data) {
				$ionicLoading.hide();
				if (data) {
					$state.go("app.meetingStatus");
				} else {
					//TODO pop up can load line
				}

			});

		}

		$scope.lineIdToGet = '';
		$scope.placeholder = 'TR_ENTERLINEID';
		$scope.searchPlaceHolder = 'TR_SEARCH';



		//when typing on inputbox
		$scope.changeInput = function(manualId) {
			$scope.lineIdToGet = manualId;
		}

		// clear the placeholder when click
		$scope.clearPlaceHolder = function() {
			$scope.placeholder = '';
			$scope.lineIdToGet = '';
		}

		$ionicModal.fromTemplateUrl('templates/ionicModal/LineList.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		//open the list of lines
		$scope.openChooseLine = function() {
				$scope.LineList = $outSideLineHandler.getDefaultLineList();
				$scope.modal.show();

			}
			//when click back
		$scope.closeChooseLine = function() {
				$scope.lineIdToGet = '';
				$scope.modal.hide();
			}
			//click on one Line
		$scope.chooseLine = function(line) {
			$scope.placeholder = line.title;
			$scope.lineIdToGet = line._id;
			$scope.modal.hide();
		}

		//iside  chooseLine function : 
		$scope.scrollToTop = function() {

		}

		$scope.searchLineByName = function(value) {
			console.log("search Value:" + value);
			if (value !== '') {
				$outSideLineHandler.searchLineByName(value).then(function(data) {
					$scope.LineList = data;
				});
			}
		}
		$scope.resetSearchBar = function(value) {
			$ionicScrollDelegate.scrollTop();
			if (value === '') {
				$scope.LineList = $outSideLineHandler.getDefaultLineList();
			}
		}
		$scope.getLine = function() {
			$ionicLoading.show({
				template: $filter('translate')('TR_Loading')
			});
			$outSideLineHandler.getLine($scope.lineIdToGet).then(function(data) {
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
					$meetingManager.setCurrent($scope.lineIdToGet).then(function(data) {
						if (!data) {
							var alertPopup = $ionicPopup.alert({
								title: "Error",
								template: "Error"
							});
						} else {
							$state.go("app.meetingStatus");
						}
					});

				} else {
					$state.go("app.getInLine");
				}
			});
		}


	})

.controller('settingCtrl', function($scope, $translate, $userManagment) {
	$scope.changeLanguage = function() {

		$translate.use('he');
	}

	$scope.logOutFB = function() {
		$userManagment.logOutFaceBook();
	}

});