const { ImageKit } = require("@imagekit/nodejs")      //63


//to initiate ImageKit
const ImageKitClient = new ImageKit({                         //64
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

//function to upload files to imagekit
async function uploadFile(file) {                               //65
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "bishwajit-backend-dev/music"
    })

    return result                                        //66
}

module.exports = { uploadFile }                         //67