const mongoose = require('mongoose');  //6



const userSchema = new mongoose.Schema({      //7

    //7
    username: {
        type: String,
        //db won't create a new user unless you don't give username
        required: true,   //makes username field mandatory to fill
        unique: true
    },

    email: {
        type: String,
        required: true,  
        unique: true
    }, 

    password: {
        type: String,
        required: true,
    },

    //normal user can only listen to music songs
    //artist can create musics also
    role: {
        type: String,
        //enum tells this role property will have only one out of these two below roles; except these no other value
        enum: [ 'user', 'artist' ],  //as two categories of users will use this app
        default: 'user', //if no role choosen, then default is set to be user
    }

})


//collection user
const userModel = mongoose.model("user", userSchema)       //8


module.exports = userModel                  //9