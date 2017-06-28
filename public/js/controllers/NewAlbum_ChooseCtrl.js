angular.module('NewAlbum_ChooseCtrl', []).controller('NewAlbum_ChooseController', function($scope, $window, sharedProperties) {

    $scope.tagline = 'Lets do this!';

    let AlbumKeywords = sharedProperties.getProperty();

    $scope.keywordOne   = AlbumKeywords.data[0];
    $scope.keywordTwo   = AlbumKeywords.data[1];
    $scope.keywordThree = AlbumKeywords.data[2];

});