const fetch = require('node-fetch')

export async function apiCalls(bigData) {

    const errorMessage = document.getElementById('error-message')
    const serverError = "Couldn't connect to server. Try again later."

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

    const weatherbitData = await callServer('callweather', bigData)
    if (weatherbitData == null) {
        errorMessage.innerHTML = serverError
        return null
    }
    bigData["forecastData"] = Client.extractForecastData(weatherbitData, bigData.userData.timeUntilTrip, bigData.userData.timeUntilReturn)
    console.log(bigData.forecastData)

    const photoData = await callServer('callphoto', bigData)
    if (photoData == null) {
        errorMessage.innerHTML = serverError
        return null
    }
    bigData["photo"] = Client.extractPhoto(photoData)
    console.log(bigData.photo)

    const storeMessage = await callServer('storedata', bigData)
    console.log(storeMessage)

    return bigData
}

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
        if (!response.ok) {
            console.log(`Error connecting to http://localhost:8081/${url}. Response status ${response.status}`)
            return null
        }
        const responseJSON = await response.json()
        return responseJSON
    } catch (error) {
        console.log(`Error connecting to server: ${error}`)
        return null
    }
}