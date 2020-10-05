export function submitted(event) {
    event.preventDefault()
    console.log('Event listener connected')
    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)
    const departureDate = document.getElementById('departure-date').value
    console.log(`Departure date: ${departureDate}`)

}