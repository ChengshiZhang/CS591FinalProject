angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		// my page
		.when('/nerds', {
			templateUrl: 'views/nerd.html',
			controller: 'NerdController'
		})

		// upload pictures for the new album
        .when('/NewAlbum_Upload', {
            templateUrl: 'views/NewAlbum_Upload.html',
            controller: 'NewAlbum_UploadController'
        })

		// choose album name and color
        .when('/NewAlbum_Choose', {
            templateUrl: 'views/NewAlbum_Choose.html',
            controller: 'NewAlbum_ChooseController'
        })

		// choose album music
        .when('/NewAlbum_Music', {
            templateUrl: 'views/NewAlbum_Music.html',
            controller: 'NewAlbum_MusicController'
        });

	$locationProvider.html5Mode(true);

}]);