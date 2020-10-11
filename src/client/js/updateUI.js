/**
 * Updates the UI elements
 * @param {object} bigData data acquired so far from user and APIs
 */
export function updateUI(bigData) {

    // Countdown display
    let messageEnd;
    if (bigData.userData.timeUntilTrip == 0) {
        messageEnd = "is today! Are you ready to go?"
    } else if (bigData.userData.timeUntilTrip == 1) {
        messageEnd = "is tomorrow! Are you packed?"
    } else {
        messageEnd = `is coming up in ${bigData.userData.timeUntilTrip} days!`
    }
    document.getElementById('how-many-sleeps').innerHTML = `Your ${bigData.userData.tripDuration + 1}-day trip to ${bigData.userData.destinationCity}, ${bigData.cityData.country} ${messageEnd}`

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

    // Create document fragment to add to true DOM all at once
    // This is better performance, each add to DOM has a cost
    let fragment = document.createDocumentFragment()
    fragment.append(locationImage)

    // Create the button to change the image
    const changeImageButton = document.createElement('button')
    changeImageButton.innerHTML = "Change Image"
    changeImageButton.classList.add('change-image-button')

    // Add the click listener
    changeImageButton.addEventListener('click', () => {
        // Get a random photo, clear storage, set storage again
        // The resetting of the storage makes sure that same photo will
        // be loaded again if user comes back
        bigData.photo = Client.extractRandomPhoto(bigData.photoData)
        locationImage.src = bigData.photo
        localStorage.clear()
        localStorage.setItem('bigData', JSON.stringify(bigData))
    })
    fragment.append(changeImageButton)
    imageContainer.append(fragment)


    fragment = document.createDocumentFragment()
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