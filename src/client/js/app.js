export function submitted(event) {
    event.preventDefault()
    console.log('Event listener connected')
    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)
    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)
    const userData = { "destination": destinationCity, "departure": departureDate }
    console.log(userData)

    sendToServer(userData)

}

function sendToServer(userData) {
    fetch('http://localhost:8081/call', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(userData)
    })
}