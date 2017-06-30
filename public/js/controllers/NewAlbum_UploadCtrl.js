angular.module('NewAlbum_UploadCtrl', []).controller('NewAlbum_UploadController', function($scope, $http, $window, sharedProperties) {

    $scope.tagline = 'Gimme your pictures';


    $scope.nextButton = function nextButton() {

        $http({
            method : "GET",
            url : 'http://localhost:3000/NewAlbum_Upload/next'
        }).then(function mySuccess(response) {
            sharedProperties.setProperty(response);
        }, function myError(response) {
            sharedProperties.setProperty('$http error occurred at NewAlbum_UploadCtrl.js');
        });

    }
});