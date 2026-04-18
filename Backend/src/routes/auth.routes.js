const express = require('express');     //10

const authController = require('../controllers/auth.controller')         //29

const router = express.Router()       //10


//register api created
router.post('/register', authController.registerUser)             //12
//authController.registerUser added in step 30 {register api logic}

//login api created
router.post('/login', authController.loginUser)            //42


//logout api created
router.post("/logout", authController.logoutUser)      //147
//this is for beginners
//when in production level,
//we use token blacklisting to prevent below problem:

// user logs out → cookie deleted from browser
// but someone copied that JWT token before logout
// they can still use that token directly in Postman
// token is still valid until expiry (maybe 7 days!)


module.exports = router;             //10

