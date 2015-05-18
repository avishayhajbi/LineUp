angular.module('starter.controllers', ['ngCordova'])

.controller('menuCtrl', function($scope, $ionicModal, $timeout, $userManagment, $ionicLoading, $ionicPopup, $state) {


        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/ionicModal/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalMenu = modal;
        });

        $scope.user = {};
        $scope.$on('connectedToFB', function(event, result) {
            $scope.user = {
                id: $userManagment.getfbId(),
                name: $userManagment.getMyName(),
                connected: $userManagment.isConnected()
            };
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modalMenu.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modalMenu.show();
        };


    })
    .controller('page1Ctrl', function($scope, $ionicModal, $ionicPopup, $state, $ionicScrollDelegate, $filter, $outSideLineHandler, $ionicLoading, $lineManager, $meetingManager) {

        if (window.jumpToPage) {

            var type = window.jumpToPage[0];
            var id = window.jumpToPage[1];
            if (type === "line") {
                $outSideLineHandler.getLine(id);
            } else if (type === "meeting") {

            }

        }

        $scope.lineList = $lineManager.getLineList();
        $scope.meetingList = $meetingManager.getMeetingList();

        $scope.createLine = function() {
            $state.go("app.page2");
        }

        $scope.chooseLineNew = function(id) {
            $lineManager.setCurrent(id);
            $state.go("app.page5");
        }

        $scope.chooseMeeting = function(id) {

            $meetingManager.setCurrent(id);
            $state.go("app.page10");
        }

        $scope.lineIdToGet = '';
        $scope.placeholder = 'TR_1_ENTERLINEID';
        $scope.searchPlaceHolder = 'TR_SEARCH';

        $scope.LineList = $outSideLineHandler.getLineList();


        $scope.$on('lineListUpdated', function(event) {
            $scope.LineList = $outSideLineHandler.getLineList();
            console.log('lineListUpdated:', $scope.LineList);
        });

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
                $outSideLineHandler.searchLineByName(value);
            }

        }
        $scope.resetSearchBar = function(value) {
            $ionicScrollDelegate.scrollTop();
            if (value === '') {
                $scope.LineList = $outSideLineHandler.getDefaultLineList();
            }
        }



        $scope.getLine = function() {
            console.log("try to connect to:" + $scope.lineIdToGet);
            $outSideLineHandler.getLine($scope.lineIdToGet);
            $ionicLoading.show({
                template: $filter('translate')('TR_Loading')
            });
        }

        $scope.$on('lineInfoArrived', function(event, args) {

            $ionicLoading.hide();
            if (args === false) {
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')('TR_1_POPTITLE'),
                    template: $filter('translate')('TR_1_POPTEMPLATE')
                });
            } else if (args === "noRoom") {
                var alertPopup = $ionicPopup.alert({
                    title: "no room in line",
                    template: "no room in line"
                });

            } else if (args === "signed") {
                var alertPopup = $ionicPopup.alert({
                    title: "already signed to this line",
                    template: "already signed to this line"
                });
            } else {
                $state.go("app.page9");
            }
        });

    })
    .controller('page2Ctrl', function($scope, $filter, $state, $ionicPopup, $ionicLoading, $lineManager) {

        $scope.newLine = {};
        $scope.dates = [];
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
        $scope.PicSourece = document.getElementById('smallimage');

        function UploadPicture(imageURI) {
            if (imageURI.substring(0, 21) == "content://com.android") {
                var photo_split = imageURI.split("%3A");
                imageURI = "content://media/external/images/media/" + photo_split[1];
            }
            $scope.newLine.ImageURI = imageURI;
            $scope.PicSourece.src = imageURI;

        }
        $scope.ShowPictures = function() {
            navigator.camera.getPicture(UploadPicture, function(message) {
                console.log('get picture failed');
            }, {
                quality: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
        };


        $scope.insertNewDate = function() {
            $scope.data = {};
            var chooseDatePopUp = $ionicPopup.show({
                template: '<label class="item item-input"><input type="date" ng-model="data.day" placeholder="dd/MM/yyyy"></label><label class="item item-input row row-center"><span class="col col-25">from:</span><input type="time" class="col col-75" ng-model="data.from" placeholder="HH:mm"></label><label class="item item-input row row-center"><span class="col col-25">to:</span><input type="time" class="col col-75" ng-model="data.to" placeholder="HH:mm"></label>',
                title: 'choose date:',
                subTitle: '',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!checkAtt($scope.data.day) && !checkAtt($scope.data.from) && !checkAtt($scope.data.to)) {
                            e.preventDefault();
                        } else {
                            return $scope.data;
                        }
                    }
                }]
            });
            chooseDatePopUp.then(function(data) {

                data.from.setDate(data.day.getDate());
                data.from.setMonth(data.day.getMonth());
                data.from.setFullYear(data.day.getFullYear());
                data.to.setDate(data.day.getDate());
                data.to.setMonth(data.day.getMonth());
                data.to.setFullYear(data.day.getFullYear());
                delete data.day;

                $scope.dates.push(data);

            });

        };

        $scope.createLine = function() {
            if (!checkAtt($scope.newLine.confirmTime) || !checkAtt($scope.dates) || !checkAtt($scope.newLine.druation)) {
                var alertPopup = $ionicPopup.alert({
                    title: 'missing information',
                    template: 'please fill all information'
                });
            } else {
                var newLine = $scope.newLine;
                newLine.ImageURI = $scope.PicSourece.src;
                newLine.availableDates = $scope.dates;
                newLine.active = false;
                $lineManager.createLine(newLine);
                $ionicLoading.show({
                    template: $filter('translate')('TR_Loading')
                });
            }
        }

        $scope.$on('lineCreated', function(event, args) {
            $ionicLoading.hide();
            if (args === false) {
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')('TR_1_POPTITLE'),
                    template: $filter('translate')('TR_1_POPTEMPLATE')
                });
            } else {
                $state.go("app.page3");
            }
        });

    })
    .controller('page3Ctrl', function($scope, $userManagment, $phoneManager) {

        $scope.signInEmail = function() {
            $scope.modalMenu.show();
        };

        $scope.signInFackBook = function() {
            $userManagment.connectToFaceBook();
        };

    })

.controller('page4Ctrl', function($scope, $lineManager, $cordovaSocialSharing, $state) {

        $scope.line = $lineManager.getCurrentLine();
        if (!$scope.line) {
            $scope.line = {};
            $scope.line.link = "link not avilable";
        } else {
            $scope.line.link = "lineup://?line=" + $scope.line.id;
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
            $state.go("app.page5");
        };


    })
    .controller('page5Ctrl', function($scope, $state, $lineManager) {

        $scope.line = $lineManager.getCurrentLine();

        $scope.shareLine = function() {
            $state.go("app.page4");
        };

    })


.controller('page6Ctrl', function($scope, $state) {


    $scope.nextMeeting = function() {
        console.log("Move to next Meeting");
    };

    $scope.postponeMeeting = function() {
        console.log("Postpone current Meeting");
    };

    $scope.sendMessage = function() {
        console.log("Send message");
        $scope.modalMessageMenu.show();
    };

    $scope.switchMeetings = function() {
        console.log("Switch Meetings");
    };

    $scope.fillEmptyMeeting = function() {
        console.log("Fill empty Meeting");
    };


    $scope.endLine = function() {
        console.log("End line");
    };

})

.controller('page7Ctrl', function($scope) {


})

.controller('page9Ctrl', function($scope, $state, $meetingManager, $outSideLineHandler, $ionicLoading, $filter, $ionicPopup) {

        $scope.meeting = $outSideLineHandler.getLineInfo();


        $scope.joinLine = function() {

            $meetingManager.joinLine($scope.meeting);
            $ionicLoading.show({
                template: $filter('translate')('TR_Loading')
            });
        }

        $scope.$on('signedToNewMeet', function(event, args) {
            $ionicLoading.hide();
            if (!args) {
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')('TR_1_POPTITLE'),
                    template: $filter('translate')('TR_1_POPTEMPLATE')
                });
            } else {
                $state.go("app.page10");
            }
        });

    })
    .controller('page10Ctrl', function($scope, $meetingManager, $ionicPopup, $ionicLoading, $filter, $state, $timeout) {
        // $meetingManager.getPosition();

        //$scope.meeting = $meetingManager.getCurrentMeeting();
        $scope.meeting = {
            time: new Date(new Date().getTime() + 120 * 60000),
            confirmTime: 180,
            druation: 60,
            position:5,
            timeLeft :  { days: 1,
                     hours: 1,
                     minutes: 1
        }};

        $scope.style = {};
        $scope.reminder = true;
        $scope.ProgressCounter = false;

        var startCount = new Date($scope.meeting.time.getTime() - (($scope.meeting.confirmTime + $scope.meeting.druation) * 60000));
        var timeToWait = $scope.meeting.time.getTime() - startCount;
        var timeInMs = Date.now();


        if (timeInMs > startCount.getTime()) {

            $scope.ProgressCounter = true;
            var remainingTime = timeInMs - startCount;
            var progressWidth = (100 * remainingTime) / timeToWait;

            $scope.style.width = progressWidth;

            // window.proInt = 0;
            // var prog = setInterval(function() {

            //     if (window.proInt =>  progressWidth) {
            //         clearInterval(prog);
            //         break;
            //     } else {
            //         $scope.style.width = window.proInt;
            //         window.proInt++;
            //     }

            // }, 200);

        }


        $meetingManager.updateMeeting();
        var updateInt = setInterval(function() {
            $meetingManager.updateMeeting();
        }, 60000);

        $scope.$on("positionUpdated", function() {
            $scope.meeting = $meetingManager.getCurrentMeeting();
        });


        $scope.cancelLine = function() {

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
                        $meetingManager.cancelMeeting($scope.meeting);
                        $ionicLoading.show({
                            template: $filter('translate')('TR_Loading')
                        });
                    }
                }]
            });
        }
        $scope.$on('meetingCancled', function(event, args) {

            $ionicLoading.hide();
            if (!args) {
                var alertPopup = $ionicPopup.alert({
                    title: "please try again",
                    template: "please try again"
                });
            } else {
                var canceledPopup = $ionicPopup.show({
                    template: 'meeting canceld',
                    title: 'meeting canceld',
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
                    $state.go("app.page1");
                });
            }
        });


    })
    .controller('page11Ctrl', function($scope) {

    })

        .controller('page12Ctrl', function($scope) {

    })

.controller('settingCtrl', function($scope, $translate, $userManagment) {
        $scope.changeLanguage = function() {
            $translate.use('he');
        }
        $scope.logOutFB = function() {
            $userManagment.logOutFaceBook();
        }

    })
    .controller('mainCtrl', function($scope, $ionicPopup, $timeout, $cordovaSocialSharing) {
        //open screen delay 
        setTimeout(function() {
            $scope.$apply(function() {
                $("#welcomeScreen").animate({
                    opacity: 0,
                    top: "+1000"
                }, 2000, function() {
                    $("#welcomeScreen").hide();
                });
            });
        }, 3000);

    });