const countdown = require('countdown')

export async function submitted(event) {
    event.preventDefault()
    console.log('Event listener connected')

    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)

    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)
    const returnDate = document.getElementById('return-date').value
    console.log(`Return date: ${returnDate}`)

    const timeUntilTrip = countdown(null, new Date(departureDate), countdown.DAYS).days
    console.log(`Days until departure: ${timeUntilTrip}`)
    const timeUntilReturn = countdown(null, new Date(returnDate), countdown.DAYS).days
    const tripDuration = timeUntilReturn - timeUntilTrip

    const unitsInput = document.querySelector('input[name="units"]:checked').value
    let units
    if (unitsInput == "imperial") {
        units = "I"
    } else {
        units = "M"
    }

    let bigData = {}
    bigData["userData"] = { destinationCity, departureDate, timeUntilTrip, timeUntilReturn, tripDuration, units }
    console.log(bigData.userData)

    bigData = await apiCalls(bigData)
    updateUI(bigData)
}

async function apiCalls(bigData) {

    const geonameData = await getGeonameData(bigData.userData.destinationCity)
    bigData["cityData"] = extractCityData(geonameData)
    console.log(bigData.cityData)

    const weatherbitData = await getWeatherbitData(bigData.cityData, bigData.userData.units)
    bigData["forecastData"] = extractForecastData(weatherbitData, bigData.userData.timeUntilTrip, bigData.userData.tripDuration)
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

async function getWeatherbitData(cityData, units) {
    const response = await fetch('http://localhost:8081/callweather', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify({ cityData, units })
    })

    const responseJSON = await response.json()
    return responseJSON
}

function extractForecastData(weatherbitData, timeUntilTrip, tripDuration) {
    const forecastData = []

    // counter max is 15 because API currently returns max 16 days data
    let lastForecastDay = 15
    if ((timeUntilTrip + tripDuration) < 15) {
        lastForecastDay = timeUntilTrip + tripDuration
    }
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

    let daysString = "days"
    if (bigData.userData.timeUntilTrip == 1) {
        daysString = "day"
    }
    document.getElementById('countdown').innerHTML = `Your trip to ${bigData.userData.destinationCity} is coming up in ${bigData.userData.timeUntilTrip} ${daysString}!`
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
        const forecastCard = createForecastCard(forecast, bigData.userData.units)
        fragment.append(forecastCard)
    }
    const forecastCardContainer = document.getElementById('forecast-card-container')
    forecastCardContainer.innerHTML = ""
    forecastCardContainer.append(fragment)

}

function createForecastCard(forecast, units) {
    let temperatureUnit = "C"
    let speedUnit = "m/s"
    let depthUnit = "mm"
    if (units == "I") {
        temperatureUnit = "F"
        speedUnit = "mph"
        depthUnit = "in"
    }

    const forecastCard = document.createElement('div')
    forecastCard.classList.add('forecast-card')

    const dateDiv = document.createElement('div')
    dateDiv.classList.add('date')
    dateDiv.innerHTML = forecast.date

    const iconDiv = document.createElement('div')
    iconDiv.classList.add('icon')
    iconDiv.innerHTML = `<img src="./icons/${forecast.icon}.png">`

    const descriptionDiv = document.createElement('div')
    descriptionDiv.classList.add('description')
    descriptionDiv.innerHTML = forecast.description

    const highTemperatureDiv = document.createElement('div')
    highTemperatureDiv.classList.add('high-temperature')
    highTemperatureDiv.innerHTML = `High temperature: ${forecast.highTemperature}\xB0${temperatureUnit}`

    const lowTemperatureDiv = document.createElement('div')
    lowTemperatureDiv.classList.add('low-temperature')
    lowTemperatureDiv.innerHTML = `Low temperature: ${forecast.lowTemperature}\xB0${temperatureUnit}`

    const humidityDiv = document.createElement('div')
    humidityDiv.classList.add('humidity')
    humidityDiv.innerHTML = `Humidity: ${forecast.humidity}%`

    const chancePrecipitationDiv = document.createElement('div')
    chancePrecipitationDiv.classList.add('chance-precipitation')
    chancePrecipitationDiv.innerHTML = `Chance of precipitation: ${forecast.chancePrecipitation}%`

    const precipitationDiv = document.createElement('div')
    precipitationDiv.classList.add('precipitation')
    precipitationDiv.innerHTML = `Precipitation amount: ${forecast.precipitation.toFixed(1)}${depthUnit}`

    const snowDiv = document.createElement('div')
    snowDiv.classList.add('snow')
    snowDiv.innerHTML = `Snow amount: ${forecast.snow.toFixed(1)}${depthUnit}`

    const windSpeedDiv = document.createElement('div')
    windSpeedDiv.classList.add('wind-speed')
    windSpeedDiv.innerHTML = `Windspeed: ${forecast.windSpeed.toFixed(1)}${speedUnit}`

    const windDirectionDiv = document.createElement('div')
    windDirectionDiv.classList.add('wind-direction')
    windDirectionDiv.innerHTML = `Wind direction: ${forecast.windDirection}\xB0`

    forecastCard.append(dateDiv)
    forecastCard.append(iconDiv)
    forecastCard.append(descriptionDiv)
    forecastCard.append(highTemperatureDiv)
    forecastCard.append(lowTemperatureDiv)
    forecastCard.append(humidityDiv)
    forecastCard.append(chancePrecipitationDiv)
    forecastCard.append(precipitationDiv)
    forecastCard.append(snowDiv)
    forecastCard.append(windSpeedDiv)
    forecastCard.append(windDirectionDiv)

    return forecastCard
}