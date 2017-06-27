angular.module('NewAlbum_UploadCtrl', []).controller('NewAlbum_UploadController', function($scope, $http) {

    $scope.taglinee = 'Gimme your pictures';

    $scope.nextButton = function nextButton() {

        const request = {
            method: 'post',
            url: 'http://localhost:3000/api/NewAlbum_Upload_Next',
            data: {
                name: 'Winston',
                line: 'hithere',
                surprise: 'Hey, it actually works!'
            }
        }

        $http(request)
            .then(function (response) {
                    $scope.inputForm.$setPristine()
                    $scope.name = $scope.line = ''
                    console.log(response)
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
    }
);