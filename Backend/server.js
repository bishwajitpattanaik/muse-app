require('dotenv').config()                              //2
const app = require('./src/app')                       //2

const connectDB = require('./src/db/db')               //4
connectDB()                                            //5

// app.listen(3000, () => {                              //2
//     console.log("Server is running on port 3000")
// })

const PORT = process.env.PORT || 3001                   //render deployment
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})