export async function callServer(url, bigData) {
    try {
        const response = await fetch(`http://localhost:8081/${url}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            // Body data type must match "Content-Type" header        
            body: JSON.stringify(bigData)
        })
        if (!response.ok) {
            console.log(`Error connecting to http://localhost:8081/${url}. Response status ${response.status}`)
            return null
        }
        const responseJSON = await response.json()
        return responseJSON
    } catch (error) {
        console.log(`Error connecting to server: ${error}`)
        return null
    }
}