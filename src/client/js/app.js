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

    // Initialise error and result fields
    const errorMessage = document.getElementById('error-message')
    errorMessage.innerHTML = ""
    document.getElementById('forecast-card-container').innerHTML = ""
    document.getElementById('how-many-sleeps').innerHTML = ""
    document.getElementById('location-image-container').innerHTML = ""
    document.getElementById('forecast-title').innerHTML = ""

    // Destination city
    const destinationCity = document.getElementById('destination-city').value
    if (destinationCity == "") {
        errorMessage.innerHTML = "Please enter a destination city"
        return
    }

    // Departure date
    const departureDate = document.getElementById('departure-date').value
    if (departureDate == "") {
        errorMessage.innerHTML = "Please enter a departure date"
        return
    }

    // Return date
    // Not required, will just give full forecast results if left blank
    const returnDate = document.getElementById('return-date').value
    if (returnDate == "") {
        errorMessage.innerHTML = "Please enter a return date"
        return
    }

    const timeUntilTrip = getTimeUntilDate(departureDate)

    const timeUntilReturn = getTimeUntilDate(returnDate)

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

    // Calls the API function, then updates the UI if all connections succeeded
    bigData = await Client.apiCalls(bigData)
    // If connections didn't succeed, null is returned, so checking for that
    if (bigData != null) {
        Client.updateUI(bigData)

        // Add all data to local storage
        localStorage.setItem('bigData', JSON.stringify(bigData))
    }
}


/**
 * Trip countdown. Checks that return is not before departure.
 * Use millisecond times for today, departure and return.
 * Set hours to 1 (1am) on all 3 times, because if hours difference is
 * greater than 12, rounding error can occur. In testing, after 21:00
 * my time, if departure date was today, the difference between Date()
 * and Date(departureDate) would be -1 days. The difference between 
 * today and tomorrow would be 0 days. I want the program to strictly 
 * follow calendar dates, because it screwed up the forecast dates 
 * and trip duration calculations. The countdown function also
 * introduced a rounding error if straight dates were used in testing 
 * after 21:00, due to it assuming the time on departure and return 
 * dates is 09:00.
 * @param {string} date A date in the format yyyy-mm-dd
 */
function getTimeUntilDate(date) {
    const todayMilliseconds = (new Date()).setHours(1)

    const dateMilliseconds = (new Date(date)).setHours(1)
    const timeUntilDate = countdown(todayMilliseconds, dateMilliseconds, countdown.DAYS).days
    return timeUntilDate
}