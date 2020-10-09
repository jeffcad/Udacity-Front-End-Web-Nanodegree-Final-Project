export async function callServer(url, bigData) {
    const response = await fetch(`http://localhost:8081/${url}`, {
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