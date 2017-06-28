angular.module('NewAlbum_MusicCtrl', []).controller('NewAlbum_MusicController', function($scope, sharedProperties, $http, $sce) {

    let searchResults = sharedProperties.getProperty();

    $scope.plugInURL = function plugInURL(){

        $scope.musicURL1 = $sce.trustAsResourceUrl(searchResults.data[0]);
        $scope.musicURL2 = $sce.trustAsResourceUrl(searchResults.data[1]);
        $scope.musicURL3 = $sce.trustAsResourceUrl(searchResults.data[2]);
    }

    $scope.ChooseMusic_1 = function ChooseMusic_1(){
        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseMusic_1'
        })
    }

    $scope.ChooseMusic_2 = function ChooseMusic_2(){
        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseMusic_2'
        })
    }

    $scope.ChooseMusic_3 = function ChooseMusic_3(){
        $http({
            method : "POST",
            url : 'http://localhost:3000/api/ChooseMusic_3'
        })
    }

    $scope.nextPage = function nextPage(){
        $http({
            method : "GET",
            url : 'http://localhost:3000/api/NewAlbum_Music_Next'
        })
    }

});