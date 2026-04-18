const express = require('express')                //1
const cookieParser = require('cookie-parser')     //1
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')   //11
const musicRoutes = require('./routes/music.routes')         //46

const app = express()                            //1

// app.use(cors({
//     origin: [
//         'http://localhost:5173',        // vite default
//         'http://localhost:3000',        // local frontend
//         // 'https://muse-app-chi.vercel.app'  // production frontend --> old domain
//         'https://muse-app-bishwajitpattanaik.vercel.app' // new domain
//     ],
//     credentials: true
// }))

//will work for every vercel domain
app.use(cors({
    origin: function(origin, callback) {
        // allow localhost and any vercel.app domain
        if (!origin || 
            origin.includes('localhost') || 
            origin.includes('vercel.app')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

app.use(express.json())                          //1
app.use(cookieParser())                          //1

app.get('/healthz', (req, res) => {             //health check for Render
    res.status(200).json({ status: 'ok' })
})

//prefix for api
app.use('/api/auth', authRoutes)          //11
app.use('/api/music', musicRoutes)                   //47

module.exports = app                            //1