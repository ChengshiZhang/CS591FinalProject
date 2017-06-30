// Note: Improvement could be made by make the buttons in a group
// and then just have one function that sends the request to back-end with the button selected specified
angular.module('NewAlbum_MusicCtrl', []).controller('NewAlbum_MusicController', function($scope, sharedProperties, $http, $sce) {

    // Retrive the 3 URLs for the Spotify Play Button
    let searchResults = sharedProperties.getProperty();

    // Have to use the $sce service to plug in the url into iframe
    $scope.plugInURL = function plugInURL(){
        $scope.musicURL1 = $sce.trustAsResourceUrl(searchResults.data[0]);
        $scope.musicURL2 = $sce.trustAsResourceUrl(searchResults.data[1]);
        $scope.musicURL3 = $sce.trustAsResourceUrl(searchResults.data[2]);
    };

    // Music 1 is selected, notify the back-end
    $scope.ChooseMusic_1 = function ChooseMusic_1(){
        $http({
            method : "POST",
            url : 'http://localhost:3000/NewAlbum_Music/music_1'
        })
    };

    // Music 2 is selected, notify the back-end
    $scope.ChooseMusic_2 = function ChooseMusic_2(){
        $http({
            method : "POST",
            url : 'http://localhost:3000/NewAlbum_Music/music_2'
        })
    };

    // Music 3 is selected, notify the back-end
    $scope.ChooseMusic_3 = function ChooseMusic_3(){
        $http({
            method : "POST",
            url : 'http://localhost:3000/NewAlbum_Music/music_3'
        })
    };

    // The next button is clicked
    $scope.nextPage = function nextPage(){
        $http({
            method : "GET",
            url : 'http://localhost:3000/NewAlbum_Music/next'
        })
    }

});