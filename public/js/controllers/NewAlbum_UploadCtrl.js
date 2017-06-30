angular.module('NewAlbum_UploadCtrl', []).controller('NewAlbum_UploadController', function($scope, $http, $window, sharedProperties) {

    $scope.tagline = 'Gimme your pictures';

    /* When the 'next' button is clicked:
    * Send a GET request to the back-end API and obtain the top 3 keywords detected from the photos uploaded
    * Then store the result into the "sharedProperties" service so that NewAlbum_Choose controller can access
    * */
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