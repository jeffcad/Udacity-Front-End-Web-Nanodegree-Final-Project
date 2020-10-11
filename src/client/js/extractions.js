/**
 * Extracts only 4 pieces of information from Geonames API data
 * @param {object} geonameData Data returned from Geonames API
 */
export function extractCityData(geonamesData) {
    const longitude = geonamesData.geonames[0].lng
    const latitude = geonamesData.geonames[0].lat
    const country = geonamesData.geonames[0].countryName
    const population = geonamesData.geonames[0].population

    return { latitude, longitude, country, population }
}

/**
 * Extracts only desired forecast information from larger Weatherbit API data
 * @param {object} weatherbitData Data returned from Weatherbit API
 * @param {integer} timeUntilTrip Number of days until trip start date
 * @param {integer} timeUntilReturn Number of days until trip end date
 */
export function extractForecastData(weatherbitData, bigData) {

    // An array to hold objects each representing 1 day of forecast data
    const forecastData = []

    // Define these here just to shorten the references to them
    let timeUntilTrip = bigData.userData.timeUntilTrip
    let timeUntilReturn = bigData.userData.timeUntilReturn
    const departureDate = bigData.userData.departureDate

    // Checks if there is a mismatch between local time of user and local time 
    // at destination, adjusts dates accordingly
    if (!(departureDate == weatherbitData.data[timeUntilTrip].valid_date)) {
        console.log(`Date difference between user and destination detected!`)
        // If departure date matches the next element in the forecast array, 
        // then current local date is 1 day behind user's date, and should
        // start at next element in the array
        if (departureDate == weatherbitData.data[timeUntilTrip + 1].valid_date) {
            console.log(`Destination current local date is 1 day behind user's date`)
            timeUntilTrip += 1
            timeUntilReturn += 1
            // Otherwise current local date must be 1 date after user's date
        } else {
            console.log(`Destination current local date is 1 day ahead of user's date`)
            if (timeUntilTrip > 0) {
                timeUntilTrip -= 1
            }
            if (timeUntilReturn > 0) {
                timeUntilReturn -= 1
            }
        }
    }

    // counter max is 15 because API currently returns max 16 days data
    let lastForecastDay = 15
    if (timeUntilReturn < 15) {
        lastForecastDay = timeUntilReturn
    }
    // Grab the weather information out of larger data 
    for (let i = timeUntilTrip; i <= lastForecastDay; i++) {
        const date = weatherbitData.data[i].valid_date
        const windSpeed = weatherbitData.data[i].wind_spd
        const windDirection = weatherbitData.data[i].wind_dir
        const highTemperature = weatherbitData.data[i].high_temp
        const lowTemperature = weatherbitData.data[i].low_temp
        const chancePrecipitation = weatherbitData.data[i].pop
        const precipitation = weatherbitData.data[i].precip
        const snow = weatherbitData.data[i].snow
        const humidity = weatherbitData.data[i].rh
        const description = weatherbitData.data[i].weather.description
        const icon = weatherbitData.data[i].weather.icon

        // Add an object containing all extracted weather information for this 
        // day to the array above
        forecastData.push({ date, windSpeed, windDirection, highTemperature, lowTemperature, chancePrecipitation, precipitation, snow, humidity, description, icon })
    }
    return forecastData
}

// Could also make photo selection random?
/**
 * Extracts the most-liked photo from the list
 * @param {object} photoData Data returned from Pixabay API
 */
export function extractPhoto(photoData) {
    // Holds the most number of likes so far
    let topLikes = 0
    let chosenPhoto = ""
    // Largest value of a "page" in returned photo results
    let count = 200
    // Set count lower if fewer than 200 results were returned
    if (photoData.totalHits < count) {
        count = photoData.totalHits
    }
    // Check if each photo has more likes than current champ
    // Replace previous photo if this one has more likes
    for (let i = 0; i < count; i++) {
        if (photoData.hits[i].likes > topLikes) {
            chosenPhoto = photoData.hits[i].webformatURL
            topLikes = photoData.hits[i].likes
        }
    }
    console.log(`Top photo had ${topLikes} likes`)
    return chosenPhoto
}