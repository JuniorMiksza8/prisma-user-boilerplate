import app from '../../app'
import request from 'supertest'
import faker from 'faker'

describe('Test user controller', () => {
    let userID: string | undefined = undefined

    test('should retrieve users', async () => {
        const response = await request(app).get('/user')
        expect(response.statusCode).toBe(200)
    })

    test('should create new user', async () => {
        const user = {
            username: faker.name.findName(),
            email: faker.internet.email(faker.name.findName()),
            password: faker.internet.password(),
        }

        const response = await request(app).post('/user').send(user)

        userID = response.body.id

        expect(response.statusCode).toBe(201)
    })

    test('should update created user', async () => {
        const data = {
            email: faker.internet.email(faker.name.findName()),
        }

        const response = await request(app).put(`/user/${userID}`).send(data)
        expect(response.body.email).toBe(data.email)
    })

    test('should delete created user', async () => {
        expect(userID).toBeDefined()

        const response = await request(app).delete(`/user/${userID}`)
        expect(response.status).toBe(200)
    })
})
