var sprintf   = require('sprintf-js').sprintf;
var base64Img = require('base64-img');
var request   = require("request");

var Nerd = require('./models/nerd');
var User = require('./models/User');
var currentUser = require('../config/currentUser');
var googleConfig = require('../config/googleConfig');

module.exports = function(app) {

    app.post('/api/upload', function(req, res) {

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

            // Call the Google Vision API with the base-64 formatted image
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
                    { type: 'WEB_DETECTION', maxResults: 3 } ] } ] },
            json: true };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                console.log(body);
            });
        });


    });

    app.post('/api/NewAlbum_Upload', function(req, res) {
        //res.sendfile('./public/views/NewAlbum_Upload.html');
        res.json(req.body);
        console.log(req.body);
    });

    app.get('/api/nerds', function(req, res) {
        // use mongoose to get all nerds in the database
        Nerd.find(function(err, nerds) {

            // if there is an error retrieving, send the error.
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(nerds); // return all nerds in JSON format
        });
    });

    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};