const mongoose = require('mongoose')                  //46


const musicSchema = new mongoose.Schema({                   //47
    
    uri: {                //for storing music files in imagekit
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    artist: {                      
        type: mongoose.Schema.Types.ObjectId,    //id of a particular artist
        //artist is literally a user
        //so it's details will get stored in user collection
        //so user collection reference is to be given
        ref: "user", //collection name is to be given as ref
        required: true
    }
})

const musicModel = mongoose.model("music", musicSchema)              //48

module.exports = musicModel                //49