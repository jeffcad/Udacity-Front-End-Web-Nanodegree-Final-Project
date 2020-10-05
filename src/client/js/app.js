export function submitted(event) {
    event.preventDefault()

    console.log('Event listener connected')
    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)
    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)
    const userData = { "destination": destinationCity, "departure": departureDate }
    console.log(userData)
    apiCalls(userData)
}

async function apiCalls(userData) {
    const locationData = await getGeonameData(userData)
    console.log(locationData)
}

async function getGeonameData(userData) {
    const response = await fetch('http://localhost:8081/callgeo', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(userData)
    })

    const responseJSON = await response.json()
    return responseJSON
}