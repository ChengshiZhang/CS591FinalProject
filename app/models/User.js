// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
    userID : {type : String, default: ''},
    userName : {type : String, default: ''},
    numPicture : {type : Number, default: 0},
    numAlbum : {type : Number, default: 0}
});