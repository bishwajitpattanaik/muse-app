const musicModel = require('../models/music.model')          //50
const { uploadFile } = require('../services/storage.service')      //68
const albumModel = require('../models/album.model')           //85
const jwt = require('jsonwebtoken')                     //54


//to make it protected i.e only user who is artist(defined in enum earlier) can create music
//not a normal user can assess this functionality --> it will get 403 forbidden error if it tried
async function createMusic(req, res){                         //51


    //108 --> now we dont require the token validation logic here in controllers,
    //as we have written them in middlewares folder's auth.middleware.js -->
    //so just commenting out logic -> 52-59, 57(or 78)
    //but during revision dont skip this part



    //implementing this through tokens
    // const token = req.cookies.token     //access tokens           //52

    // //if token doesn't come, then return msg "unauthorised"
    // if(!token){                                                //53
    //     return res.status(401).json({
    //         message: "Unauthorized"
    //     })
    // }

    // //validate if token is valid or not                      //55
    
    // //we need to handle error if token is not valid          //56
    // try{
    //     //jwt.verify(token, process.env.JWT_SECRET) --> token is verfied
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET)   //data in token is saved to decoded  //58
    
    //     //if id in data came in token along with msg req role property is not artist, then return error msg
    //     if(decoded.role !== "artist"){              //59
    //         return res.status(403).json({
    //             message: "Access to music creation is denied"
    //         })
    //     }

        //if it have access to our music then let it move fwd


        // }catch(err){    //if token is not valid, handle error           
        //     return res.status(401).json({                        //57
        //         message: "Unauthorized"
        //     })
        // }

        //to create music               //60
        const {title} = req.body;
        const file = req.file; 
        //we have to setup imagekit to upload music file to cloud service    //61
        //imagekit docs in browser > nodejs > doc in git > installation(npm install @imagekit/nodejs) ...  
        //create a new folder services under src        //62

        //convert file that came into our folder into base64           
        const result = await uploadFile(file.buffer.toString('base64'))         //69

        //with the help of result, we will create music
        const music = await musicModel.create({                             //70
            uri: result.url,   //access file url from imagekit in result
            title,             //title
            //artist: decoded.id    //access artist id from decoded   
            //commenting artist: decoded.id --> 110
            artist: req.user.id    //111
        }) 


        res.status(201).json({                          //71
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist,
            }
        })

    // }catch(err){    //if token is not valid, handle error        //78 shift catch to bottom as decoded was in try so error was coming 
        
    //     console.log(err)

    //     return res.status(401).json({                        //57
    //         message: "Unauthorized"
    //     })
    // }

}

//create album api logic
async function createAlbum(req, res){           //86
    //artist validation i.e from tokens
    //import tokens from req.cookies.token(from cookies specifically)
    
    //108 --> now we dont require the token validation logic here in controllers,
    //as we have written them in middlewares folder's auth.middleware.js -->
    //so just commenting out logic -> 87-92, 89
    //but during revision dont skip this part
    
    // const token = req.cookies.token                                     //87

    // //if token not come or token is not present in cookie(if user is not logged in)            
    // if(!token){                                                                           //88
    //     return res.status(401).json({
    //         message: "Unauthorized"
    //     })
    // }

    // //verify token if token comes
    // try{                                                                                                       //90

    //     const decoded = jwt.verify(token, process.env.JWT_SECRET)        //save data from token to decoded     //91

    //     //main step of this function: artist validation     
    //     if(decoded.role !== "artist"){                  //92     //if user is not artist by checking role property of decoded (data of user from token)
    //         message: "Access denied to create an album"
    //     }

        //token is of artist, so it create album
        //import title and music ids from req.body
        const { title, musics } = req.body             //93

        const album = await albumModel.create({             //94
            title,
            //artist: decoded.id,
            //commenting artist: decoded.id, ---> //112
            artist: req.user.id,    //113
            musics: musics
        })

        //after creating album, response is sent
        res.status(201).json({                             //95
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics
            }
        })


    // }catch(err){             //if token is not valid                           //89
    //     console.log(err)
        
    //     return res.status(401).json({
    //         message: "Unauthourized"
    //     })
    
    // }

}

//get music api logic
async function getAllMusics(req, res){            //115

    //finding music from musicModel and storing it in musics
    const musics = await musicModel
        .find()
      //for pagination purpose                            //142
      //.skip(1)    //skips the musics by defined argument and brings the musics after it
      //.limit(20)                            //if get all musics at once server storage will be exhausted and at once all songs cant be sent to client so a limit is set to find and get songs in limited manner(times)
        .populate("artist", "username email")        //116
    //populate("artist", "username email") added in 120th step to show you all details of artist
    //we can use it as we have defined aritist's object id and ref in models(music.model)
    //"username email" --> only bring username and email of artist

    //sending music along with a msg
    res.status(200).json({                      //117
        message: "Audios fetched successfully",
        musics: musics
    })
}

////get albums api logic
async function getAllAlbums(req, res) {          //131
    
    //finding albums from albumModel and storing it in albums
    const albums = await albumModel.find().select("title artist").populate("artist", "username email")   //132
    //added .select("title artist") in 135th step
    //as you won't be loading all musics everytime you opened an album
    //so to prevent it we added
    //so after album loads how can we bring musics on that
    //we will be creating another api for loading music by album id


    //sending albums along with a msg
    res.status(200).json({                      //133
        message: "Albums fetched successfully",
        musics: albums
    })

}

////get musics by album id api logic
async function getAlbumById(req, res) {         //137
    
    //extracting albumId from the URL params (e.g. /albums/:albumId)
    const albumId = req.params.albumId                                 //138

    //find the album in DB by its ID
    //.populate("artist", "username email") → replaces artist ObjectId 
    //with actual artist data, but only fetches username and email fields
    //.populate("musics") → replaces musics ObjectId array
    //with full music documents
    const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")     //139


    return res.status(200).json({                    //140
        message: "Album fetched successfully",
        album: album
    })


}



module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }                 //72
//export album controller // createAlbum --> 96
//no new routes for album creation of album in music.route.js

//export getAllMusics added in 118th step 

//export getAllAlbums added in 134th step

//export getAlbumById added in 141st step