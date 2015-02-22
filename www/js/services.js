
angular.module('services', ['ngCordova']).config(['$provide', function($provide) {

$provide.factory('phoneManager', function ($ionicPopup , $cordovaSocialSharing) {

  var device , uuid;
    ionic.Platform.ready(function() {
        device = ionic.Platform.device();
        uuid = device.uuid;
    });

    return {
    shareAnywhere : function(title , subject, img , url) {
        $cordovaSocialSharing.share(title, subject, img, url);
     }
    }
  });

}]);