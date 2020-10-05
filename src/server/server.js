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
app.use(bodyParser.json())
app.use(bodyParser.text())

const GEONAMES_ROOT = "http://api.geonames.org/searchJSON?q="
const GEONAMES_KEY_URL = `&username=${GEONAMES_KEY}`
const GEONAMES_MAX_ROWS = "&maxRows=1"


const port = 8081

// Designates what port the app will listen to for incoming requests
app.listen(port,
    () => console.log(`Travel weather app listening on port ${port}!`)
)

// Serves the main page to browser
app.get('/',
    (req, res) => res.sendFile('dist/index.html')
)

app.post('/callgeo', callGeo)

async function callGeo(req, res) {
    console.log(req.body)
    console.log(`Request city is ${req.body}`)
    const city = req.body
    const geonamesURL = GEONAMES_ROOT + city + GEONAMES_KEY_URL + GEONAMES_MAX_ROWS
    console.log(`URL is ${geonamesURL}`)
    const response = await fetch(geonamesURL)
    const responseJSON = await response.json()

    res.send(responseJSON)
}



