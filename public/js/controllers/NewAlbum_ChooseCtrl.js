// Note: Improvement could be made by make the buttons in a group
// and then just have one function that sends the request to back-end with the button selected specified
angular.module('NewAlbum_ChooseCtrl', []).controller('NewAlbum_ChooseController', function($scope, $http, sharedProperties) {

    // Retrieve the top 3 keywords of all the photos
    // and prompt the user to select one as the name of the album
    let AlbumKeywords = sharedProperties.getProperty();

    $scope.keywordOne   = AlbumKeywords.data[0];
    $scope.keywordTwo   = AlbumKeywords.data[1];
    $scope.keywordThree = AlbumKeywords.data[2];

    /* The first keyword is chosen:
    * 1. Send a GET request to notify the back-end API
    * 2. The response from the back-end is 3 URLs for the Spotify Play Button
    * 3. Store the response into the sharedProperties service so that NewAlbum_Music can access
    * */
    $scope.ChooseName_1 = function ChooseName_1() {

        $http({
            method : "GET",
            url : 'http://localhost:3000/NewAlbum_Choose/name_1'
        }).then(function mySuccess(response) {
            sharedProperties.setProperty(response);
        }, function myError(response) {
            sharedProperties.setProperty('$http error occurred at NewAlbum_ChooseCtrl.js');
        });

    };

    /* The second keyword is chosen:
     * 1. Send a GET request to notify the back-end API
     * 2. The response from the back-end is 3 URLs for the Spotify Play Button
     * 3. Store the response into the sharedProperties service so that NewAlbum_Music can access
     * */
    $scope.ChooseName_2 = function ChooseName_2() {

        $http({
            method : "GET",
            url : 'http://localhost:3000/NewAlbum_Choose/name_2'
        }).then(function mySuccess(response) {
            sharedProperties.setProperty(response);
        }, function myError(response) {
            sharedProperties.setProperty('$http error occurred at NewAlbum_ChooseCtrl.js');
        });

    };

    /* The third keyword is chosen:
     * 1. Send a GET request to notify the back-end API
     * 2. The response from the back-end is 3 URLs for the Spotify Play Button
     * 3. Store the response into the sharedProperties service so that NewAlbum_Music can access
     * */
    $scope.ChooseName_3 = function ChooseName_3() {

        $http({
            method : "GET",
            url : 'http://localhost:3000/NewAlbum_Choose/name_3'
        }).then(function mySuccess(response) {
            sharedProperties.setProperty(response);
        }, function myError(response) {
            sharedProperties.setProperty('$http error occurred at NewAlbum_ChooseCtrl.js');
        });

    };

    // The first color is chosen, notify back-end API
    $scope.ChooseColor_1 = function ChooseColor_1() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/NewAlbum_Choose/color_1'
        })

    };

    // The second color is chosen, notify back-end API
    $scope.ChooseColor_2 = function ChooseColor_2() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/NewAlbum_Choose/color_2'
        })

    };

    // The third color is chosen, notify back-end API
    $scope.ChooseColor_3 = function ChooseColor_3() {

        $http({
            method : "POST",
            url : 'http://localhost:3000/NewAlbum_Choose/color_3'
        })

    };

    //unused
    $scope.next = function next(){
        $http({
            method : "GET",
            url : 'http://localhost:3000/NewAlbum_Choose/next'
        })
    }

});