const express = require('express')                //1
const cookieParser = require('cookie-parser')     //1
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')   //11
const musicRoutes = require('./routes/music.routes')         //46

const app = express()                            //1

app.use(cors({
    origin: [
        'http://localhost:5173',        // vite default
        'http://localhost:3001',        // your local frontend
        'https://your-app.vercel.app'  // add after Vercel deploys
    ],
    credentials: true
}))

app.use(express.json())                          //1
app.use(cookieParser())                          //1


//prefix for api
app.use('/api/auth', authRoutes)          //11
app.use('/api/music', musicRoutes)                   //47

module.exports = app                            //1