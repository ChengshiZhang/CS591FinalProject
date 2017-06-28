angular.module('NewAlbum_ChooseCtrl', []).controller('NewAlbum_ChooseController', function($scope, $http, sharedProperties) {

    $scope.tagline = 'Lets do this!';

    let AlbumKeywords = sharedProperties.getProperty();

    $scope.keywordOne   = AlbumKeywords.data[0];
    $scope.keywordTwo   = AlbumKeywords.data[1];
    $scope.keywordThree = AlbumKeywords.data[2];

    $scope.ChooseName_1 = function ChooseName_1() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseName_1'
        })

    }

    $scope.ChooseName_2 = function ChooseName_2() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseName_2'
        })

    }

    $scope.ChooseName_3 = function ChooseName_3() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseName_3'
        })

    }

    $scope.ChooseColor_1 = function ChooseColor_1() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseColor_1'
        })

    }

    $scope.ChooseColor_2 = function ChooseColor_2() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseColor_2'
        })

    }

    $scope.ChooseColor_3 = function ChooseColor_3() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseColor_3'
        })

    }

});