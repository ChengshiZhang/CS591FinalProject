angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/nerds', {
			templateUrl: 'views/nerd.html',
			controller: 'NerdController'
		})

		.when('/geeks', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		})

        .when('/NewAlbum_Upload', {
            templateUrl: 'views/NewAlbum_Upload.html',
            controller: 'NewAlbum_UploadController'
        });

	$locationProvider.html5Mode(true);

}]);