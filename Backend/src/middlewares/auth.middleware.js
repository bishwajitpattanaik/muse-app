//in this file, we will store an auth middleware to carry out checks such as token came or not, token is of artist or not
//as we are using code to validate token, verify token, authenticate user on basis of token repetatively in both create music and album controllers
//we can use middleware to carry out that processes

const jwt = require('jsonwebtoken')             //98

//middlewares take 3 parameters

//middleware to authenticate artist to create music or album
async function authArtist(req, res, next){            //99

    const token = req.cookies.token                                  //100    
         
    if(!token){                                                      //101                     
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {                                                               //102

        const decoded = jwt.verify(token, process.env.JWT_SECRET)       //103

        if(decoded.role !== "artist"){                                //104
            message: "Access denied to create an album"
        }

        //as middlewares can modify data
        //so create a new property in req which can be accessed movingfwd i.e in controllers
        req.user = decoded;  //data coming in decoded gets stored in req.user   //109 

        next()                     //moves fwd the request by user from middlewares         //105

     }
    catch (err) {                                                   //101
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized"
        })
    }


}

//middleware to authenticate user to listen or get musics  
async function authUser(req, res, next){                            //120

    const token = req.cookies.token                                  //121    
         
    if(!token){                                                      //122                     
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {                                                               //123

        const decoded = jwt.verify(token, process.env.JWT_SECRET)       //124


        //if u r not a user or artist you cant access to musics
        if(decoded.role !== "user" && decoded.role !== "artist"){                                //125
            message: "Access denied"
        }

        //as middlewares can modify data
        //so create a new property in req which can be accessed movingfwd i.e in controllers
        req.user = decoded;  //data coming in decoded gets stored in req.user   //126 

        next()                     //moves fwd the request by user from middlewares         //127

     }
    catch (err) {                                                   //123
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized"
        })
    }


}


module.exports = { authArtist, authUser }         //106

//exporting authUser in 128th step