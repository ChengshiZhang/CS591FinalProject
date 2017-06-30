// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var fileUpload    = require('express-fileupload');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

const upload = require('./app/routes/NewAlbum_Upload');
const choose = require('./app/routes/NewAlbum_Choose');
const music  = require('./app/routes/NewAlbum_Music');
const spotifyAuth = require('./app/routes/spotifyAuth');
// configuration ===========================================

// config files
var db = require('./config/db');

var port = process.env.PORT || 3000; // set our port
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)
const conn = mongoose.connection
conn.once('open', function () {
    console.log('Connection successful.')
});

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public'))
    .use(cookieParser());   // set the static files location /public/img will be /img for users



app.use(fileUpload());
// routes ==================================================
app.use('/NewAlbum_Upload', upload);
app.use('/NewAlbum_Choose', choose);
app.use('/NewAlbum_Music', music);
app.use('/', spotifyAuth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found')
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || true) {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// start app ===============================================
app.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app