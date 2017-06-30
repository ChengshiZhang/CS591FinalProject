const express = require('express')
const router = express.Router()

var sprintf   = require('sprintf-js').sprintf;
var base64Img = require('base64-img');
var request   = require("request");
var querystring = require('querystring');

var imageModel = require('../models/Image');
var currentUser = require('../../config/currentUser');
var googleConfig = require('../../config/googleConfig');

router.post('/upload', function(req, res) {

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
router.get('/next', function(req, res) {
    //res.sendfile('./public/views/NewAlbum_Upload.html');
    //res.json(req.body);

    let sortedAlbumKeywords = sortProperties(currentUser.AlbumKeywords);
    currentUser.AlbumKeywords = [sortedAlbumKeywords[0][0], sortedAlbumKeywords[1][0], sortedAlbumKeywords[2][0]];
    console.log('AlbumKeywords:', currentUser.AlbumKeywords);

    res.send(currentUser.AlbumKeywords);

});


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

module.exports = router
