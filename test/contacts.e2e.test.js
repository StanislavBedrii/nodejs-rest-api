const request = require('supertest');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const { contacts, newContact, User } = require('../model/__mocks__/data');
const app = require('../app');

const SECRET_KEY = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_KEY);
User.token = token;

jest.mock('../model/contacts.js');
jest.mock('../model/users.js');

describe('Testing the route api/contacts', () => {
    let idNewContact;
    describe('Should handle get request', () => {
        it('should return 200 status for get all contacts', async () => {
            const res = await request(app).get('/api/contacts').set('Authorization', `Bearer ${token}`)
            expect(res.status).toEqual(200);
            expect(res.body).toBeDefined();
            expect(res.body.data.contacts).toBeInstanceOf(Array);
        });
        it('should return 200 status by id', async () => {
            const contact = contacts[0];
            const res = await request(app)
                .get(`/api/contacts/${contact._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toEqual(200);
            expect(res.body).toBeDefined();
            expect(res.body.data.contact).toHaveProperty('_id');
            expect(res.body.data.contact._id).toBe(contact._id);

        });
        it('should return 404 status by wrong id', async () => {
            const wrongId = '6053813c233be106f4429de0';
            const res = await request(app)
                .get(`/api/contacts/${wrongId}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).toEqual(404);

        })
    });

    describe('Should handle post request', () => {
        it('should return 201 status create contact', async () => {
            const res = await request(app)
                .post(`/api/contacts`)
                .set('Authorization', `Bearer ${token}`)
                .send(newContact)
                .set('Accept', 'application/json');
            expect(res.status).toEqual(201);
            expect(res.body).toBeDefined();
            idNewContact = res.body.data.contact._id;
        });
        it('should return 400 status for wrong field', async () => {
            const res = await request(app)
                .post(`/api/contacts`)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...newContact, test: 1 })
                .set('Accept', 'application/json')
            expect(res.status).toEqual(400);
            expect(res.body).toBeDefined();
        });
        it('should return 400 status without required field email', async () => {
            const res = await request(app)
                .post(`/api/contacts`)
                .set('Authorization', `Bearer ${token}`)
                .send({ email: 'john@test.com' })
                .set('Accept', 'application/json')
            expect(res.status).toEqual(400);
            expect(res.body).toBeDefined();
        })
    });
    describe('Should handle patch request', () => { });
    describe('Should handle delete request', () => { });
});