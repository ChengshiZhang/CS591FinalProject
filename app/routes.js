sprintf = require('sprintf-js').sprintf;

var Nerd = require('./models/nerd');
var User = require('./models/User')
var currentUser = require('../config/currentUser')

module.exports = function(app) {

    app.post('/api/upload', function(req, res) {

        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        currentUser.numPicture++;

        let uploadedImage = req.files.uploadedImage;

        uploadDirectory = sprintf('uploads/%s_%d_%d.jpg', currentUser.userID, currentUser.numAlbum+1, currentUser.numPicture);

        // Use the mv() method to place the file somewhere on your server
        uploadedImage.mv(uploadDirectory, function(err) {
            if (err)
                return res.status(500).send(err);

            //res.json('File uploaded!');
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