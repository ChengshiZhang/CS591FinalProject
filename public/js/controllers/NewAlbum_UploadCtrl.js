angular.module('NewAlbum_UploadCtrl', []).controller('NewAlbum_UploadController', function($rootScope, $scope, $http, $window) {

    $scope.tagline = 'Gimme your pictures';

    $scope.nextButton = function nextButton() {

        console.log('aaaaaa');
        const request = {
            method: 'post',
            url: 'http://localhost:3000/api/NewAlbum_Upload_Next',
            data: {
                name: 'Winston',
                line: 'hithere',
                surprise: 'Hey, it actually works!'
            }
        }

        console.log('bbbbbbb');

        $http(request)
            .then(function (response) {
                    console.log('ccccccc');
                    $scope.inputForm.$setPristine()
                    $scope.name = $scope.line = ''
                    console.log('response from api:', response)
                    $rootScope.AlbumKeywords = response;
                },
                function (error) {
                    if (error.status === 401) {
                        $scope.authorized = false
                        $scope.h2message = "Not authorized and received error 401"
                        console.log(error)
                    }
                }
            )
    }

});