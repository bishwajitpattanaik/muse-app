//artists can create album of multiple music
//so we need to create an api for that
//before that, we have to create a schema for album
const mongoose = require("mongoose")                      //80


const albumSchema = new mongoose.Schema({                //81
    
    //to store title prototype
    title:{
        type: String,
        required: true,
    },

    //to store music prototype
    musics:[{
        type: mongoose.Schema.Types.ObjectId,     //object id from mongodb of a music
        ref:"music"  //from music collection id will be passed
    }],

    //to store artist prototype
    artist: {
        type: mongoose.Schema.Types.ObjectId,     //object id from mongodb of an artist
        ref:"user",  //from artist collection id will be passed
        required: true,
    }
})


const albumModel = mongoose.model("album", albumSchema)    //82

module.exports = albumModel       //83

//as album has no such big role, so its api needs not to be made its own controller to store its logic
//instead create a function of album api in music.controller   //84