const dotenv = require('dotenv')
dotenv.config()
const GEONAMES_KEY = process.env.GEONAMES_KEY
const WEATHERBIT_KEY = process.env.WEATHERBIT_KEY
const PIXABAY_KEY = process.env.PIXABAY_KEY

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()

app.use(cors())
app.use(express.static('dist'))

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.text())

// TODO: ADD URL CONSTRUCTIONS FOR API CALLS HERE



const port = 8081

// Designates what port the app will listen to for incoming requests
app.listen(port,
    () => console.log(`Travel weather app listening on port ${port}!`)
)

// Serves the main page to browser
app.get('/',
    (req, res) => res.sendFile('dist/index.html')
)



