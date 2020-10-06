const countdown = require('countdown')

export function submitted(event) {
    event.preventDefault()
    console.log('Event listener connected')

    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)

    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)

    const timeUntilTrip = countdown(null, new Date(departureDate), countdown.DAYS).days
    console.log(`Days until departure: ${timeUntilTrip}`)

    const userData = { "destination": destinationCity, "departure": departureDate, "countdown": timeUntilTrip }
    console.log(userData)

    apiCalls(userData)
}

async function apiCalls(userData) {
    const geonameData = await getGeonameData(userData.destination)
    const cityData = extractCityData(geonameData)
    console.log(cityData)
    const weatherbitData = await getWeatherbitData(cityData)
    const forecastData = extractForecastData(weatherbitData, userData.countdown)
    console.log(forecastData)
}

async function getGeonameData(destination) {
    const response = await fetch('http://localhost:8081/callgeo', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'text/plain'
        },
        // Body data type must match "Content-Type" header        
        body: destination
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

function extractForecastData(weatherbitData, countdown) {
    const forecastData = []

    // counter max is 15 because API currently returns max 16 days data
    for (let i = countdown; i <= 15; i++) {
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