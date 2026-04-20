const userModel = require("../models/user.model");      //13
const jwt = require("jsonwebtoken")            //19
//generate jwt secret key from jwtsecrets.com        //20

const bcrypt = require("bcryptjs")                   //25

//register api logic
async function registerUser(req, res){               //14

    //incoming data in req.body
    const { username, email, password, role = "user" } = req.body;        //15


    //validate unique name, email of user
    // const isUserAlreadyExists = await userModel.findOne({

    //     username: username,
    //     email: email
    // })

    //but above will return null when query is like this:
    /* 
    
     user 1
     username = a
     email = a@a.com
     

     user 2
     username = b
     email = b@b.com
    
        query = {
            username: a,
            email: b@b.com
        }

     but users exist with same name or email
     so it will give error
     to solve this, we use $or operator 
     wants an array of objs of multiple conditions
     if one condition got satisfied by user credentials, return that user 
    
     query = {
             $or:[
                 {username: c},
                 {email: b@b.com}
             
             
             ]
        }
    
      user 2 satisfies email condition of thsi query
      so, user 2 will be returned

    */

    //so new version of username, email validation
    const isUserAlreadyExists = await userModel.findOne({                  //16
        $or: [
            { username },
            { email }
        ]
    })


    //create a hash of password
    const hash = await bcrypt.hash(password, 10)                             //26
    //password --> user pwd
    //10 --> salt: used to delay the attack on your data breach

    if(isUserAlreadyExists){                                               //17
        return res.status(409).json({message: "User already exists"})
    }


    //if user not exists, then create a new user
    const user = await userModel.create({                                    //18
        username,
        email,
        password: hash,      //27 using hash to save pwd in db
        role
    })

    //create token: data should be of user and unique                                          //22
    const token = jwt.sign({
        id: user._id,    //only one data to be unique
        role: user.role  //user data
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
   

    res.status(201).json({                                                //24
        
        //send msg
        message: "User registered successfully",
        
        //share user details
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }

        //we will not store user pwd directly into db
        //we will store hash of pwd so that if compromised, attacker cant get original password
        //we do this by hashing(specifically, MD5 hashing) which is a cryptography algorithm
        //we need to install a package to do this
        //npm i bcryptjs to convert plain-text to hash
    })

}

//before moving fwd, we have to complete our auth apis first ----------------> 31
//creating login controller               //32


//login api logic
async function loginUser(req, res){                                                 //32
    

    const { username, email, password } = req.body                                     //33

    //returns the user on basis of its input
    //as name and email are unique
    //if it sends only one out of those fields and
    //left another field as undefined
    //then $or will handle this type of query as before
    //$or: checks if one condition satisfies, it returns the user
    const user = await userModel.findOne({                                                  //34
        $or: [
            { username },
            { email }
        ]
    })


    if (!user){                                                                         //35
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    //validate if the password coming from user matches the pwd it created in db during registering
    //bcrypt compares the hash (converted from pwd) coming from user when user try to login with the hash(converted from pwd) created in db
    const isPasswordValid = await bcrypt.compare(password, user.password)                                                                        //36
    //if pwd valids, then we will give the user login

    if(!isPasswordValid){                                                        //37
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    //create a token if password is valid
    const token = jwt.sign({                                                           //38
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET) 


    //set token in cookie                                                  //23
    // res.cookie("token", token)  --> works only on localhost
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,          // required for HTTPS
        sameSite: "none",      // required for cross-domain cookies
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    })                                                  //39


    res.status(200).json({                                             //40
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role

        }
    })

}


//logout api logic
async function logoutUser(req, res){              //143

    //delete the "token" cookie from the browser
    //since login sets a JWT token in cookie, 
    //clearing it means user is no longer authenticated
    //on next request → no token → 401 Unauthorized
    // res.clearCookie("token")               //144

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    //send success response confirming logout
    res.status(200).json({                      //145
        message: "User logged out successfully"
    })
}


//export loginUser controller                                      //41
module.exports = { registerUser, loginUser, logoutUser }                                //28
//export logoutUser controller                            //146