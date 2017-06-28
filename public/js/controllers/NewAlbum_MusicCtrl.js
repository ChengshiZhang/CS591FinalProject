angular.module('NewAlbum_MusicCtrl', []).controller('NewAlbum_MusicController', function($scope, sharedProperties, $http, $sce) {

    let searchResults = sharedProperties.getProperty();

    $scope.plugInURL = function plugInURL(){

        $scope.musicURL1 = $sce.trustAsResourceUrl(searchResults.data[0]);
        $scope.musicURL2 = $sce.trustAsResourceUrl(searchResults.data[1]);
        $scope.musicURL3 = $sce.trustAsResourceUrl(searchResults.data[2]);
    }

});