var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    userID : {type : String, default: ''},
    userName : {type : String, default: ''},
    numPicture : {type : Number, default: 0},
    numAlbum : {type : Number, default: 0}
});