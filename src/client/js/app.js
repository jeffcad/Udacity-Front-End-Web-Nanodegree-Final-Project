export async function submitted(event) {
    event.preventDefault()

    console.log('Event listener connected')
    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)
    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)
    const userData = { "destination": destinationCity, "departure": departureDate }
    console.log(userData)

    const response = await getGeonameData(userData)
    const responseJSON = await response.json()
    const cityData = responseJSON.body
    console.log(cityData)

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

    return response
}