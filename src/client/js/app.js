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