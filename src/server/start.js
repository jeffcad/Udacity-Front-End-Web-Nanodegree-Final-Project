//This file was made according to the tutorial at
//https://zellwk.com/blog/endpoint-testing/
//for endpoint testing of the server.
// Declaring port here allows for server.js file to handle multiple Jest tests
// at the same time

const app = require('./server')

// Designates what port the app will listen to for incoming requests
const port = 8081
app.listen(port,
    () => console.log(`Travel weather app listening on port ${port}!`)
)