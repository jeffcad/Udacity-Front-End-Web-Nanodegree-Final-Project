const fetch = require('node-fetch')

/**
 * Calls the 3 APIs, adds their output to bigData object
 * @param {object} bigData data acquired so far from user and APIs
 */
export async function apiCalls(bigData) {

    // Error message DOM element and message for failure to connect
    const errorMessage = document.getElementById('error-message')
    const serverError = "Couldn't connect to server. Try again later."

    // Calls the Geonames API, checks result for failure to connect
    // or user input city not returning any matches
    // Assigns result to cityData key in bigData object
    const geonamesData = await callServer('callgeo', bigData)
    if (geonamesData == null) {
        errorMessage.innerHTML = serverError
        return null
    } else if (geonamesData.geonames.length == 0) {
        errorMessage.innerHTML = `The lookup service can't find ${bigData.userData.destinationCity}. Please check the spelling and try again.`
        return null
    }
    bigData["cityData"] = Client.extractCityData(geonamesData)
    console.log(bigData.cityData)

    // Calls the Weatherbit API, checks result for failure to connect
    // Assigns result to forecastData key in bigData object
    const weatherbitData = await callServer('callweather', bigData)
    if (weatherbitData == null) {
        errorMessage.innerHTML = serverError
        return null
    }
    bigData["forecastData"] = Client.extractForecastData(weatherbitData, bigData)
    console.log(bigData.forecastData)

    // Calls the Pixabay API, checks result for failure to connect
    // Assigns result URL to photo key in bigData object
    const photoData = await callServer('callphoto', bigData)
    if (photoData == null) {
        errorMessage.innerHTML = serverError
        return null
    }
    bigData["photo"] = Client.extractMostLikedPhoto(photoData)
    bigData["photoData"] = photoData
    console.log(bigData.photo)

    // Calls the storedata route to store bigData in server variable
    const storeMessage = await callServer('storedata', bigData)
    console.log(storeMessage)

    // Return modified bigData object
    return bigData
}

/**
 * Calls the server side routes
 * @param {string} url Contains the route to server
 * @param {object} bigData data acquired so far from user and APIs
 */
export async function callServer(url, bigData) {
    try {
        const response = await fetch(`http://localhost:8081/${url}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            // Body data type must match "Content-Type" header        
            body: JSON.stringify(bigData)
        })
        // Return null if server route was not found
        if (!response.ok) {
            console.log(`Error connecting to http://localhost:8081/${url}. Response status ${response.status}`)
            return null
        }
        const responseJSON = await response.json()
        return responseJSON
        // Return null if can't connect to server at all (eg. it's turned off)
    } catch (error) {
        console.log(`Error connecting to server: ${error}`)
        return null
    }
}