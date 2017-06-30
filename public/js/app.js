angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'NerdCtrl', 'NewAlbum_UploadCtrl', 'NewAlbum_ChooseCtrl', 'NewAlbum_MusicCtrl'])

    // Enables different controllers to share data
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