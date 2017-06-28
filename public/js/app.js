angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'NerdCtrl', 'NerdService', 'GeekCtrl', 'GeekService', 'NewAlbum_UploadCtrl', 'NewAlbum_UploadService', 'NewAlbum_ChooseCtrl'])

    .service('sharedProperties', function () {
    var property = 'Default Property Value';

    return {
        getProperty: function () {
            return property;
        },
        setProperty: function(value) {
            property = value;
        }
    };
});