// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Image', {
    userID  : {type : String, default: ''},
    imageID : {type : Number, default: 0},
    album   : {type : Number, default: 0},
    content : {type : String, default: ''}
});