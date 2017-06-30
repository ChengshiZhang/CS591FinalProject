const express = require('express')
const router = express.Router()

var sprintf   = require('sprintf-js').sprintf;
var request   = require("request");
var querystring = require('querystring');
var currentUser = require('../../config/currentUser');

router.get('/name_1', function(req, res) {
    currentUser.AlbumKeywords = currentUser.AlbumKeywords[0];
    console.log(currentUser.AlbumKeywords, 'selected');

    spotifyUrl = sprintf('https://api.spotify.com/v1/search?q=%s&type=track', currentUser.AlbumKeywords);

    var options = {
        url: spotifyUrl,
        headers: { 'Authorization': 'Bearer ' + currentUser.accessToken},
        json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {

        let externalURL_1 = body.tracks.items[0].external_urls.spotify;
        let externalURL_2 = body.tracks.items[1].external_urls.spotify;
        let externalURL_3 = body.tracks.items[2].external_urls.spotify;

        externalURL_1 = externalURL_1.split("track/")[1];
        externalURL_2 = externalURL_2.split("track/")[1];
        externalURL_3 = externalURL_3.split("track/")[1];

        embedURL_1 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_1);
        embedURL_2 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_2);
        embedURL_3 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_3);

        currentUser.AlbumMusic = [embedURL_1, embedURL_2, embedURL_3];
        res.send([embedURL_1, embedURL_2, embedURL_3]);
    });
});

router.get('/name_2', function(req, res) {
    currentUser.AlbumKeywords = currentUser.AlbumKeywords[1];
    console.log(currentUser.AlbumKeywords, 'selected');

    spotifyUrl = sprintf('https://api.spotify.com/v1/search?q=%s&type=track', currentUser.AlbumKeywords);

    var options = {
        url: spotifyUrl,
        headers: { 'Authorization': 'Bearer ' + currentUser.accessToken},
        json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {

        let externalURL_1 = body.tracks.items[0].external_urls.spotify;
        let externalURL_2 = body.tracks.items[1].external_urls.spotify;
        let externalURL_3 = body.tracks.items[2].external_urls.spotify;

        externalURL_1 = externalURL_1.split("track/")[1];
        externalURL_2 = externalURL_2.split("track/")[1];
        externalURL_3 = externalURL_3.split("track/")[1];

        embedURL_1 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_1);
        embedURL_2 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_2);
        embedURL_3 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_3);

        currentUser.AlbumMusic = [embedURL_1, embedURL_2, embedURL_3];
        res.send([embedURL_1, embedURL_2, embedURL_3]);
    });
});

router.get('/name_3', function(req, res) {
    currentUser.AlbumKeywords = currentUser.AlbumKeywords[2];
    console.log(currentUser.AlbumKeywords, 'selected');

    spotifyUrl = sprintf('https://api.spotify.com/v1/search?q=%s&type=track', currentUser.AlbumKeywords);

    var options = {
        url: spotifyUrl,
        headers: { 'Authorization': 'Bearer ' + currentUser.accessToken},
        json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
        let externalURL_1 = body.tracks.items[0].external_urls.spotify;
        let externalURL_2 = body.tracks.items[1].external_urls.spotify;
        let externalURL_3 = body.tracks.items[2].external_urls.spotify;

        externalURL_1 = externalURL_1.split("track/")[1];
        externalURL_2 = externalURL_2.split("track/")[1];
        externalURL_3 = externalURL_3.split("track/")[1];

        embedURL_1 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_1);
        embedURL_2 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_2);
        embedURL_3 = sprintf('https://open.spotify.com/embed?uri=spotify:track:%s', externalURL_3);

        currentUser.AlbumMusic = [embedURL_1, embedURL_2, embedURL_3];
        res.send([embedURL_1, embedURL_2, embedURL_3]);
    });
});

router.post('/color_1', function(req, res) {
    currentUser.AlbumColor = 'cornflowerblue';
    console.log(currentUser.AlbumColor, 'selected');
});

router.post('/color_2', function(req, res) {
    currentUser.AlbumColor = 'indianred';
    console.log(currentUser.AlbumColor, 'selected');
});

router.post('/color_3', function(req, res) {
    currentUser.AlbumColor = 'darkslategrey';
    console.log(currentUser.AlbumColor, 'selected');
});

// The "Next" button on the NewAlbum_Choose page
router.get('/next', function(req, res) {

});


module.exports = router;