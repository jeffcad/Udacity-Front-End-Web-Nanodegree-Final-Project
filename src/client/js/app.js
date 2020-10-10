// This package calculates the time between now and another date/time
const countdown = require('countdown')

/**
 * Responds to user input form submit button click
 * Processes initial data, calls apiCalls function and updateUI function
 * @param {click event} event User presses submit button on form
 */
export async function submitted(event) {
    // Prevents page reloading when button is clicked
    event.preventDefault()
    console.log('Event listener connected')

    // Initialise error and result fields
    const errorMessage = document.getElementById('error-message')
    errorMessage.innerHTML = ""
    document.getElementById('forecast-card-container').innerHTML = ""
    document.getElementById('how-many-sleeps').innerHTML = ""
    document.getElementById('location-image-container').innerHTML = ""
    document.getElementById('forecast-title').innerHTML = ""

    // Destination city
    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)
    if (destinationCity == "") {
        errorMessage.innerHTML = "Please enter a destination city"
        return
    }

    // Departure date
    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)
    if (departureDate == "") {
        errorMessage.innerHTML = "Please enter a departure date"
        return
    }

    // Return date
    // Not required, will just give full forecast results if left blank
    const returnDate = document.getElementById('return-date').value
    console.log(`Return date: ${returnDate}`)

    // Trip countdown, checks that return is not before departure
    const timeUntilTrip = countdown(null, new Date(departureDate), countdown.DAYS).days
    console.log(`Days until departure: ${timeUntilTrip}`)
    const timeUntilReturn = countdown(null, new Date(returnDate), countdown.DAYS).days
    const tripDuration = timeUntilReturn - timeUntilTrip
    if (tripDuration < 0) {
        errorMessage.innerHTML = "Return date can't be before departure date"
        return
    }

    // User can select metric (C, m/s, mm) or imperial units (F, mph, in)
    // For temperature, wind speed and precipitation amount
    const unitsInput = document.querySelector('input[name="units"]:checked').value
    let units = "M"
    if (unitsInput == "imperial") {
        units = "I"
    }

    // Initialise bigData object with user's input and calculations above
    let bigData = {}
    bigData["userData"] = { destinationCity, departureDate, returnDate, timeUntilTrip, timeUntilReturn, tripDuration, units }
    console.log(bigData)

    // Calls the API function, then updates the UI if all connections succeeded
    bigData = await Client.apiCalls(bigData)
    // If connections didn't succeed, null is returned, so checking for that
    if (bigData != null) {
        updateUI(bigData)
    }

    // Add all data to local storage
    localStorage.setItem('bigData', JSON.stringify(bigData))
}

/**
 * Updates the UI elements
 * @param {object} bigData data acquired so far from user and APIs
 */
function updateUI(bigData) {

    // Countdown display
    if (bigData.userData.timeUntilTrip == 0) {
        document.getElementById('how-many-sleeps').innerHTML = `Your trip to ${bigData.userData.destinationCity}, ${bigData.cityData.country} is today! Are you ready to go?`
    } else if (bigData.userData.timeUntilTrip == 1) {
        document.getElementById('how-many-sleeps').innerHTML = `Your trip to ${bigData.userData.destinationCity}, ${bigData.cityData.country} is tomorrow! Are you packed?`
    } else {
        document.getElementById('how-many-sleeps').innerHTML = `Your trip to ${bigData.userData.destinationCity}, ${bigData.cityData.country} is coming up in ${bigData.userData.timeUntilTrip} days!`
    }

    document.getElementById('forecast-title').innerHTML = "Here is the forecast for your trip:"

    // Image of the location
    const locationImage = document.createElement('img')
    locationImage.src = bigData.photo
    locationImage.alt = `Photo taken in ${bigData.userData.destinationCity}`
    locationImage.height = 225
    locationImage.width = 300
    const imageContainer = document.getElementById('location-image-container')
    // Clears previous image (if any) and adds new one
    // Multiple images will pile up if not cleared
    imageContainer.innerHTML = ""
    imageContainer.append(locationImage)

    // Create document fragment to add to true DOM all at once
    // This is better performance, each add to DOM has a cost
    const fragment = document.createDocumentFragment()
    const forecasts = bigData.forecastData
    // Create a forecast card for each day in the trip
    for (const forecast of forecasts) {
        const forecastCard = Client.createForecastCard(forecast, bigData.userData.units)
        // Append the card to the fragment for now, leave the DOM alone
        fragment.append(forecastCard)
    }
    // Clear any old data from the card container and add new cards to true DOM
    const forecastCardContainer = document.getElementById('forecast-card-container')
    forecastCardContainer.innerHTML = ""
    forecastCardContainer.append(fragment)
}

/**
 * Loads data from local storage on page load and calls to update the UI
 * @param {load event} event Fires when page is finished loading
 */
export function checkLocalStorage(event) {
    if (localStorage.bigData) {
        const bigData = JSON.parse(localStorage.getItem('bigData'))
        updateUI(bigData)
    }
}

/**
 * Clears data from local storage and reloads page if user clicks button
 * @param {click event} event Fires when clear button is clicked
 */
export function clearLocalStorage(event) {
    localStorage.clear()
    location.reload()
}