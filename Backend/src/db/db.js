const mongoose = require('mongoose')         //3
const dns = require('dns') 

dns.setServers(['8.8.8.8', '8.8.4.4'])

//how server connects to db
async function connectDB(){                     //3

    //3
    try{

        await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        })
        console.log('Database connected successfully')

     }
    catch(error) {
        console.log('Database connection error:', error)

    }

}

module.exports = connectDB                                   //3