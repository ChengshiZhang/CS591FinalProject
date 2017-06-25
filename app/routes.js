// grab the nerd model we just created
var Nerd = require('./models/nerd');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
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

    app.post('/api/upload', function(req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFile;
        
        console.log(req.files.sampleFile);

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('uploads/pic1.jpg', function(err) {
            if (err)
                return res.status(500).send(err);

            res.send('File uploaded!');
        });
    });

    app.post('/api/NewAlbum_Upload', function(req, res) {
        //res.sendfile('./public/views/NewAlbum_Upload.html');
        res.json(req.body);
        console.log(req.body);
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};