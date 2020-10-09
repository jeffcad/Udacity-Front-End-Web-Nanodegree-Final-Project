const countdown = require('countdown')

export async function submitted(event) {
    event.preventDefault()
    console.log('Event listener connected')

    const errorMessage = document.getElementById('error-message')
    errorMessage.innerHTML = ""
    document.getElementById('forecast-card-container').innerHTML = ""
    document.getElementById('how-many-sleeps').innerHTML = ""
    document.getElementById('location-image-container').innerHTML = ""
    document.getElementById('forecast-title').innerHTML = ""

    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)
    if (destinationCity == "") {
        errorMessage.innerHTML = "Please enter a destination city"
        return
    }

    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)
    if (departureDate == "") {
        errorMessage.innerHTML = "Please enter a departure date"
        return
    }

    const returnDate = document.getElementById('return-date').value
    console.log(`Return date: ${returnDate}`)

    const timeUntilTrip = countdown(null, new Date(departureDate), countdown.DAYS).days
    console.log(`Days until departure: ${timeUntilTrip}`)
    const timeUntilReturn = countdown(null, new Date(returnDate), countdown.DAYS).days
    const tripDuration = timeUntilReturn - timeUntilTrip
    if (tripDuration < 0) {
        errorMessage.innerHTML = "Return date can't be before departure date"
        return
    }

    const unitsInput = document.querySelector('input[name="units"]:checked').value
    let units = "M"
    if (unitsInput == "imperial") {
        units = "I"
    }

    let bigData = {}
    bigData["userData"] = { destinationCity, departureDate, returnDate, timeUntilTrip, timeUntilReturn, tripDuration, units }
    console.log(bigData)

    bigData = await Client.apiCalls(bigData)
    if (bigData != null) {
        updateUI(bigData)
    }
}

function updateUI(bigData) {

    if (bigData.userData.timeUntilTrip == 0) {
        document.getElementById('how-many-sleeps').innerHTML = `Your trip to ${bigData.userData.destinationCity}, ${bigData.cityData.country} is today! Are you ready to go?`
    } else if (bigData.userData.timeUntilTrip == 1) {
        document.getElementById('how-many-sleeps').innerHTML = `Your trip to ${bigData.userData.destinationCity}, ${bigData.cityData.country} is tomorrow! Are you packed?`
    } else {
        document.getElementById('how-many-sleeps').innerHTML = `Your trip to ${bigData.userData.destinationCity}, ${bigData.cityData.country} is coming up in ${bigData.userData.timeUntilTrip} days!`
    }
    document.getElementById('forecast-title').innerHTML = "Here is the forecast for your trip:"
    const locationImage = document.createElement('img')
    locationImage.src = bigData.photo
    locationImage.alt = `Photo taken in ${bigData.userData.destinationCity}`
    locationImage.height = 225
    locationImage.width = 300
    const imageContainer = document.getElementById('location-image-container')
    imageContainer.innerHTML = ""
    imageContainer.append(locationImage)

    const fragment = document.createDocumentFragment()
    const forecasts = bigData.forecastData
    for (const forecast of forecasts) {
        const forecastCard = Client.createForecastCard(forecast, bigData.userData.units)
        fragment.append(forecastCard)
    }
    const forecastCardContainer = document.getElementById('forecast-card-container')
    forecastCardContainer.innerHTML = ""
    forecastCardContainer.append(fragment)
}
