const express = require('express')
const cors = require('cors')

const restaurantRouter = require('./routes/restaurants.js')
const userprofilesRouter = require('./routes/userprofiles')

const app = express()

// Middleware for PUT or POST
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Middleware CORS
app.use(cors())



//Register router

app.use('/api/restaurants', restaurantRouter)
app.use('/api/userprofiles', userprofilesRouter)



let port = 3001
app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port: ${port}`)
})

