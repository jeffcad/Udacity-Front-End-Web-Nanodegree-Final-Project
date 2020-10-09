//check explanation at https://zellwk.com/blog/endpoint-testing/

const app = require('../src/server/server')
const supertest = require('supertest')
const request = supertest(app)

describe("Tests the storeData function", () => {

    it("returns a message to confirm storage", async () => {
        const response = await request.post('/storedata', "testData")
        expect(response.body.message).toBe("Data received and stored")
    })

    it("confirms status 200", async () => {
        const response = await request.post('/storedata', "testData")
        expect(response.status).toBe(200)
    })
})