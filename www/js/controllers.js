angular.module('starter.controllers', ['ngCordova'])

.controller('menuCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalMenu = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modalMenu.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modalMenu.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('page1Ctrl' , function ($scope  , phoneManager)  {
  var title = "hi there";
  var sub = "sub";
  var img = "img";
  var url = "url";

  $scope.share = function()  {
      phoneManager.shareAnywhere(title , sub , img , url);
  }

  $scope.playlists = [{
    title: 'Reggae',
    id: 1
  }, {
    title: 'Chill',
    id: 2
  }, {
    title: 'Dubstep',
    id: 3
  }, {
    title: 'Indie',
    id: 4
  }, {
    title: 'Rap',
    id: 5
  }, {
    title: 'Cowbell',
    id: 6
  }];
})

.controller('page2Ctrl', function($scope) {


  })
  .controller('page3Ctrl', function($scope) {


  })

.controller('page4Ctrl', function($scope) {


})

.controller('page5Ctrl', function($scope) {


})

.controller('page6Ctrl', function($scope) {


  })
  .controller('page7Ctrl', function($scope) {


  })

.controller('page8Ctrl', function($scope) {


})

.controller('page9Ctrl', function($scope) {


})

.controller('page10Ctrl', function($scope) {


})

.controller('page11Ctrl', function($scope) {


})

.controller('mainCtrl', function($scope, $ionicPopup, $timeout , $cordovaSocialSharing) {
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


  })

;

