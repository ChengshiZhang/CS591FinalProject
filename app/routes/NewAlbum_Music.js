/*This module is the backend api for selecting music of the album
 * Front-end controllers that makes calls to this module: NewAlbum_MusicCtrl.js
 */
const express = require('express')
const router = express.Router()

var sprintf   = require('sprintf-js').sprintf;
var request   = require("request");
var userModel = require('../models/User');
var currentUser = require('../../config/currentUser');

// The first album music suggestion is selected
router.post('/music_1', function(req, res) {
    currentUser.AlbumMusic = currentUser.AlbumMusic[0];
    console.log('music 1 selected');
});

// The second album music suggestion is selected
router.post('/music_2', function(req, res) {
    currentUser.AlbumMusic = currentUser.AlbumMusic[1];
    console.log('music 2 selected');
});

// The third album music suggestion is selected
router.post('/music_3', function(req, res) {
    currentUser.AlbumMusic = currentUser.AlbumMusic[2];
    console.log('music 3 selected');
});

// The "Next" button on the NewAlbum_Music page
router.get('/next', function(req, res) {

    // Store the User's info to database
    const aUser = new userModel({
        userID : currentUser.userID,
        userName : currentUser.userName,
        numPicture : currentUser.numPicture,
        numAlbum : currentUser.numAlbum+1,
        AlbumKeywords: currentUser.AlbumKeywords,
        AlbumColor: currentUser.AlbumColor,
        AlbumMusic: currentUser.AlbumMusic
    });

    aUser.save(function(err) {
        if (err) {res.send(err)}
        else {
            console.log('User stored!');
        }
    })
});


module.exports = router;