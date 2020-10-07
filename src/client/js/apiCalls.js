export async function getGeonameData(destinationCity) {
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

export async function getWeatherbitData(cityData, units) {
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

// Can refactor this one to use the getGeoname function instead
// Pass different route URL in, then it's the same
export async function getPhotoData(destinationCity) {
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