var mongoose = require('mongoose');

/* The image model allows having a separate database to store images
* since images are converted to base-64 format and demands much more space than the user model
* */
module.exports = mongoose.model('Image', {
    userID  : {type : String, default: ''},
    imageID : {type : Number, default: 0},
    album   : {type : Number, default: 0},
    content : {type : String, default: ''}
});