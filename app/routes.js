var sprintf   = require('sprintf-js').sprintf;
var base64Img = require('base64-img');
var request   = require("request");
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var Nerd = require('./models/nerd');
var User = require('./models/User');
var imageModel = require('./models/Image');
var currentUser = require('../config/currentUser');
var googleConfig = require('../config/googleConfig');
var spotifyConfig = require('../config/spotifyConfig');

module.exports = function(app) {

    //===============================Spotify=============================================//
    var client_id = spotifyConfig.client_id; // Your client id
    var client_secret = spotifyConfig.client_secret; // Your secret
    var redirect_uri = spotifyConfig.redirect_uri; // Your redirect uri

    /**
     * Generates a random string containing numbers and letters
     * @param  {number} length The length of the string
     * @return {string} The generated string
     */
    var generateRandomString = function(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    var stateKey = 'spotify_auth_state';

    app.get('/login', function(req, res) {
        
        console.log('login callllled');

        var state = generateRandomString(16);
        res.cookie(stateKey, state);

        // your application requests authorization
        var scope = 'user-read-private user-read-email';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            }));
    });

    app.get('/callback', function(req, res) {

        // your application requests refresh and access tokens
        // after checking the state parameter

        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;

        if (state === null || state !== storedState) {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'state_mismatch'
                }));
        } else {
            res.clearCookie(stateKey);
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                json: true
            };

            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {

                    var access_token = body.access_token,
                        refresh_token = body.refresh_token;

                    currentUser.accessToken = access_token;

                    var options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function(error, response, body) {
                        console.log(body);
                    });

                    // we can also pass the token to the browser to make requests from there
                    res.redirect('/#' +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token
                        }));
                } else {
                    res.redirect('/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                }
            });
        }
    });

    app.get('/refresh_token', function(req, res) {

        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        });
    });

//======================================================================================//

    app.post('/api/NewAlbum_Upload_Upload', function(req, res) {

        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // Increment the number of pictures and create path to store them
        currentUser.numPicture++;
        filePath = sprintf('uploads/%s_%d_%d.jpg', currentUser.userID, currentUser.numAlbum+1, currentUser.numPicture);

        // Get the image file and move it to path created
        let uploadedImage = req.files.uploadedImage;
        uploadedImage.mv(filePath, function(err) {
            if (err)
                return res.status(500).send(err);
        });

        // Convert image file to base-64
        base64Img.base64(filePath, function(err, data) {

            // Store the image file to database
            const anImage = new imageModel({
                userID  : currentUser.userID,
                imageID : currentUser.numPicture,
                album   : currentUser.numAlbum+1,
                content : data
            });

            anImage.save(function(err) {
                if (err) {res.send(err)}
                //send back the new person
                else {
                    console.log('Image stored!');
                }
            })

            // Call Google's Cloud Vision API with the base-64 formatted image
            let base64Content = data.split(",");

            var options = { method: 'POST',
                url: 'https://vision.googleapis.com/v1/images:annotate',
                qs: { key: googleConfig.key },
                headers:
                    {   'cache-control': 'no-cache',
                        'content-type': 'application/json' },
                body:
                    { requests:
                        [ { image: { content: base64Content[1] },
                features:
                    [ { type: 'FACE_DETECTION', maxResults: 5 },
                      { type: 'WEB_DETECTION',  maxResults: 3 } ] } ] },
                json: true
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                // Select 3 keywords from the result
                let selectedKeywords = selectKeywords(body);
                console.log(selectedKeywords);

                // Insert all keywords obtained from all photos into an object
                for(i = 0; i < 3; i++) {
                    if (currentUser.AlbumKeywords[selectedKeywords[i]] == undefined) {
                        currentUser.AlbumKeywords[selectedKeywords[i]] = 1;
                    }else{
                        currentUser.AlbumKeywords[selectedKeywords[i]]++;
                    }
                }

            });
        });


    });

    // The "Next" button on the NewAlbum_Upload page
    app.get('/api/NewAlbum_Upload_Next', function(req, res) {
        //res.sendfile('./public/views/NewAlbum_Upload.html');
        //res.json(req.body);

        let sortedAlbumKeywords = sortProperties(currentUser.AlbumKeywords);
        currentUser.AlbumKeywords = [sortedAlbumKeywords[0][0], sortedAlbumKeywords[1][0], sortedAlbumKeywords[2][0]];
        console.log('AlbumKeywords:', currentUser.AlbumKeywords);

        res.send(currentUser.AlbumKeywords);

    });

    //
    app.get('/api/ChooseName_1', function(req, res) {
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

            res.send([embedURL_1, embedURL_2, embedURL_3]);
        });
    });

    app.get('/api/ChooseName_2', function(req, res) {
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
            res.send([body.tracks.items[0].external_urls.spotify, body.tracks.items[1].external_urls.spotify, body.tracks.items[2].external_urls.spotify]);
        });
    });

    app.get('/api/ChooseName_3', function(req, res) {
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
            res.send([body.tracks.items[0].external_urls.spotify, body.tracks.items[1].external_urls.spotify, body.tracks.items[2].external_urls.spotify]);
        });
    });

    app.post('/api/ChooseColor_1', function(req, res) {
        currentUser.AlbumColor = 'cornflowerblue';
        console.log(currentUser.AlbumColor, 'selected');
    });

    app.post('/api/ChooseColor_2', function(req, res) {
        currentUser.AlbumColor = 'indianred';
        console.log(currentUser.AlbumColor, 'selected');
    });

    app.post('/api/ChooseColor_3', function(req, res) {
        currentUser.AlbumColor = 'darkslategrey';
        console.log(currentUser.AlbumColor, 'selected');
    });

    // The "Next" button on the NewAlbum_Choose page
    app.get('/api/NewAlbum_Choose_Next', function(req, res) {

    });

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

    app.post('/api/error', function(req, res) {
        console.log('/api/error called');
    });
};

/*===============================HELPER FUNCTIONS===================================*/

// Sort the list of keywords from all the pictures in the album
let sortProperties = function(obj)
{
    // convert object into array
    var sortable=[];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function(a, b)
    {
        return b[1]-a[1]; // compare numbers
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
};


// Selects 3 most representative keywords from the Google's Cloud Vision API call result
let selectKeywords = function (callResult) {

    let selectedKeywords = [];

    // If the result contains no faceAnnotations analysis
    if(callResult.responses[0].faceAnnotations == null){
        return selectedKeywords;
    }else{
        // First check the face annotation
        // If the confidence is less than 0.9, face annotation analysis will be ignored
        if(callResult.responses[0].faceAnnotations[0].detectionConfidence > 0.8){
            // If the emotion detected is joy
            if(callResult.responses[0].faceAnnotations[0].joyLikelihood == 'VERY_LIKELY'){
                selectedKeywords.push('Happy');
            }
            // If the emotion detected is anger
            else if(callResult.responses[0].faceAnnotations[0].angerLikelihood == 'VERY_LIKELY'){
                selectedKeywords.push('Angry Days');
            }
            // If the emotion detected is sorrow
            else if(callResult.responses[0].faceAnnotations[0].sorrowLikelihood == 'VERY_LIKELY'){
                selectedKeywords.push('Sad Days');
            }
            // If the emotion detected is surprise
            else if(callResult.responses[0].faceAnnotations[0].surpriseLikelihood == 'VERY_LIKELY'){
                selectedKeywords.push('Wow!');
            }
        }

        // Then check the web detection

        let selLen = selectedKeywords.length;
        for (i = 0; i < 3 - selLen; i++) {
            selectedKeywords.push(callResult.responses[0].webDetection.webEntities[i].description);
        }

    }

    return selectedKeywords;
};

let searchMusic = function(){

    spotifyUrl = sprintf('https://api.spotify.com/v1/search?q=%s&type=track', currentUser.AlbumKeywords);

    var options = {
        url: spotifyUrl,
        headers: { 'Authorization': 'Bearer ' + currentUser.accessToken},
        json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
        return body.tracks.items[0].external_urls.spotify;
        console.log(body.tracks.items[0].external_urls.spotify);
    });

}