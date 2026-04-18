//in this file we will be creating an api which will enable artists to create music
//and forbid the user to create music

const express = require('express')           //43

const musicController = require('../controllers/music.controller')      //73

const authMiddleware = require('../middlewares/auth.middleware')    //106


//middleware to parse files
const multer = require('multer')    //75

const upload = multer({                  //76
    storage: multer.memoryStorage()
})

const router = express.Router()             //44

//create music api but logic is in music controller
router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic)         //74
//upload.single("music") added after installing and requiring multer  //77
//authMiddleware.authArtist added   //107

//create album api but logic is in music controller
router.post("/album", authMiddleware.authArtist, musicController.createAlbum)                   //97
//authMiddleware.authArtist added  //108

//get music api
router.get("/", authMiddleware.authUser, musicController.getAllMusics)              //114
//added musicController.getAllMusics controller in 119th step
//added authMiddleware.authUser middleware in 129th step

//get albums api
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums)    //130

//get musics by album id
router.get("/albums/:albumId", authMiddleware.authUser, musicController.getAlbumById)   //136


module.exports = router                   //45