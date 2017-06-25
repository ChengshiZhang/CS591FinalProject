angular.module('NewAlbum_UploadService', []).factory('NewAlbum_Upload', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/nerds');
        },

        // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
        post : function() {
            console.log('called post() in service');
            return $http.post('/api/NewAlbum_Upload', {name: 'Winston'});
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/nerds/' + id);
        }
    }

}]);