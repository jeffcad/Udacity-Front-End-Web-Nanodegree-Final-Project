const countdown = require('countdown')

export async function submitted(event) {
    event.preventDefault()
    console.log('Event listener connected')

    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)

    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)

    const timeUntilTrip = countdown(null, new Date(departureDate), countdown.DAYS).days
    console.log(`Days until departure: ${timeUntilTrip}`)

    let bigData = {}
    bigData["userData"] = { destinationCity, departureDate, timeUntilTrip }
    console.log(bigData.userData)

    bigData = await apiCalls(bigData)
    updateUI(bigData)
}

async function apiCalls(bigData) {

    const geonameData = await getGeonameData(bigData.userData.destinationCity)
    bigData["cityData"] = extractCityData(geonameData)
    console.log(bigData.cityData)

    const weatherbitData = await getWeatherbitData(bigData.cityData)
    bigData["forecastData"] = extractForecastData(weatherbitData, bigData.userData.timeUntilTrip)
    console.log(bigData.forecastData)

    const photoData = await getPhotoData(bigData.userData.destinationCity)
    console.log(photoData)
    bigData["photo"] = extractPhoto(photoData)
    console.log(bigData.photo)

    const storeMessage = await storeBigData(bigData)
    console.log(storeMessage)

    return bigData
}

async function getGeonameData(destinationCity) {
    const response = await fetch('http://localhost:8081/callgeo', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'text/plain'
        },
        // Body data type must match "Content-Type" header        
        body: destinationCity
    })

    const responseJSON = await response.json()
    return responseJSON
}

function extractCityData(geonameData) {
    const longitude = geonameData.geonames[0].lng
    const latitude = geonameData.geonames[0].lat
    const country = geonameData.geonames[0].countryName
    const population = geonameData.geonames[0].population

    return { latitude, longitude, country, population }
}

async function getWeatherbitData(cityData) {
    const response = await fetch('http://localhost:8081/callweather', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(cityData)
    })

    const responseJSON = await response.json()
    return responseJSON
}

function extractForecastData(weatherbitData, timeUntilTrip) {
    const forecastData = []

    // counter max is 15 because API currently returns max 16 days data
    for (let i = timeUntilTrip; i <= 15; i++) {
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
        forecastData.push({ date, windSpeed, windDirection, highTemperature, lowTemperature, chancePrecipitation, precipitation, snow, humidity, description, icon })
    }
    return forecastData
}

// Can refactor this one to use the getGeoname function instead
// Pass different route URL in, then it's the same
async function getPhotoData(destinationCity) {
    const response = await fetch('http://localhost:8081/callphoto', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'text/plain'
        },
        // Body data type must match "Content-Type" header        
        body: destinationCity
    })

    const responseJSON = await response.json()
    return responseJSON
}

// Could also make photo selection random
function extractPhoto(photoData) {
    let topLikes = 0
    let chosenPhoto = ""
    let count = 100
    if (photoData.totalHits < count) {
        count = photoData.totalHits
    }
    for (let i = 0; i < count; i++) {
        if (photoData.hits[i].likes > topLikes) {
            chosenPhoto = photoData.hits[i].webformatURL
            topLikes = photoData.hits[i].likes
        }
    }
    console.log(`Top photo had ${topLikes} likes`)
    return chosenPhoto
}

async function storeBigData(bigData) {
    const response = await fetch('http://localhost:8081/storedata', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(bigData)
    })

    const responseJSON = await response.json()
    return responseJSON
}

function updateUI(bigData) {

    let days = "days"
    if (bigData.userData.timeUntilTrip == 1) {
        days = "day"
    }
    document.getElementById('countdown').innerHTML = `Your trip to ${bigData.userData.destinationCity} is coming up in ${bigData.userData.timeUntilTrip} ${days}!`
    document.getElementById('forecast-title').innerHTML = "Here is the forecast for your trip:"
    const locationImage = document.createElement('img')
    locationImage.src = bigData.photo
    locationImage.height = 225
    locationImage.width = 300
    const imageContainer = document.getElementById('location-image-container')
    imageContainer.innerHTML = ""
    imageContainer.append(locationImage)

    const fragment = document.createDocumentFragment()
    const forecasts = bigData.forecastData
    for (const forecast of forecasts) {
        const forecastCard = createForecastCard(forecast)
        fragment.append(forecastCard)
    }
    const forecastCardContainer = document.getElementById('forecast-card-container')
    forecastCardContainer.append(fragment)

}

function createForecastCard(forecast) {

    const forecastCard = document.createElement('div')
    forecastCard.classList.add('forecast-card')

    //Can I clean this all up into an iteration? Spread operator?
    const dateDiv = document.createElement('div')
    dateDiv.classList.add('date')
    dateDiv.innerHTML = `Date: ${forecast.date}`
    const iconDiv = document.createElement('div')
    iconDiv.classList.add('icon')
    iconDiv.innerHTML = `<img src="./icons/${forecast.icon}.png">`
    const descriptionDiv = document.createElement('div')
    descriptionDiv.classList.add('description')
    descriptionDiv.innerHTML = forecast.description
    const highTemperatureDiv = document.createElement('div')
    highTemperatureDiv.classList.add('high-temperature')
    highTemperatureDiv.innerHTML = `High temperature: ${forecast.highTemperature} degrees`
    const lowTemperatureDiv = document.createElement('div')
    lowTemperatureDiv.classList.add('low-temperature')
    lowTemperatureDiv.innerHTML = `Low temperature: ${forecast.lowTemperature} degrees`
    const chancePrecipitationDiv = document.createElement('div')
    chancePrecipitationDiv.classList.add('chance-precipitation')
    chancePrecipitationDiv.innerHTML = `Chance of precipitation: ${forecast.chancePrecipitation}%`

    forecastCard.append(dateDiv)
    forecastCard.append(iconDiv)
    forecastCard.append(descriptionDiv)
    forecastCard.append(highTemperatureDiv)
    forecastCard.append(lowTemperatureDiv)
    forecastCard.append(chancePrecipitationDiv)

    return forecastCard
}