const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

beforeAll(async () => {
    await mongoose
        .connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('BookingsRoutes', () => {
    describe('list', () => {
        it('should use default values when none is passed', async (done) => {
            const res = await request(app).get('/bookings?hotelId=123qwe');
            expect(res.statusCode).toEqual(200);
            expect(res.body.total).toBe(0);
            expect(res.body.page).toBe(parseInt(process.env.DEFAULT_PAGE, 10));
            expect(res.body.size).toBe(parseInt(process.env.DEFAULT_SIZE_VALUE, 10));
            expect(res.body.data).toEqual([]);
            done();
        });

        it('should use max size values when value exceeds 50', async (done) => {
            const res = await request(app).get('/bookings?hotelId=123qwe&size=999999&page=1');
            expect(res.statusCode).toEqual(200);
            expect(res.body.total).toBe(0);
            expect(res.body.page).toBe(1);
            expect(res.body.size).toBe(parseInt(process.env.MAX_SIZE_VALUE, 10));
            expect(res.body.data).toEqual([]);
            done();
        });

        it('should use min size values when value is less than 10', async (done) => {
            const res = await request(app).get('/bookings?hotelId=123qwe&size=0&page=1');
            expect(res.statusCode).toEqual(200);
            expect(res.body.total).toBe(0);
            expect(res.body.page).toBe(1);
            expect(res.body.size).toBe(parseInt(process.env.MIN_SIZE_VALUE, 10));
            expect(res.body.data).toEqual([]);
            done();
        });

        it('should use passed values when valid', async (done) => {
            const res = await request(app).get('/bookings?hotelId=123qwe&size=20&page=1');
            expect(res.statusCode).toEqual(200);
            expect(res.body.total).toBe(0);
            expect(res.body.page).toBe(1);
            expect(res.body.size).toBe(20);
            expect(res.body.data).toEqual([]);
            done();
        });

        it('should return empty array when no bookings', async (done) => {
            const res = await request(app).get('/bookings?hotelId=123qwe');
            expect(res.statusCode).toEqual(200);
            expect(res.body.total).toBe(0);
            expect(res.body.page).toBe(1);
            expect(res.body.size).toBe(20);
            expect(res.body.data).toEqual([]);
            done();
        });

        it('should list all existing bookings', async (done) => {
            const expectedHotelId = 'here:pds:place:840drt2z-da7d929da56241ab90a63e9b04581a3e';
            const expectedGuests = [
                {
                    name: 'More Persons 3',
                    document: '123456',
                },
                {
                    name: 'More Persons 4',
                    document: '987654',
                },
            ];
            await request(app)
                .post('/bookings')
                .send({
                    hotelId: expectedHotelId,
                    guests: expectedGuests,
                    checkin: '04-05-2021 12:00:00',
                    checkout: '04-17-2021 10:00:00',
                });
            const res = await request(app).get('/bookings?hotelId=here:pds:place:840drt2z-da7d929da56241ab90a63e9b04581a3e');
            expect(res.statusCode).toEqual(200);
            expect(res.body.total).toBe(1);
            expect(res.body.page).toBe(1);
            expect(res.body.size).toBe(20);
            expect(res.body.data).toEqual([
                {
                    hotelId: expectedHotelId,
                    guests: expectedGuests,
                    checkin: '2021-04-05T15:00:00.000Z',
                    checkout: '2021-04-17T13:00:00.000Z',
                },
            ]);
            done();
        });

        it('should require hotelId', async (done) => {
            const res = await request(app).get('/bookings');
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Invalid params: hotelId');
            done();
        });
    });

    describe('create', () => {
        it('should book a hotel', async (done) => {
            const expectedHotelId = 'here:pds:place:840drt2z-da7d929da56241ab90a63e9b04581a3e';
            const expectedGuests = [
                {
                    name: 'More Persons 3',
                    document: '123456',
                },
                {
                    name: 'More Persons 4',
                    document: '987654',
                },
            ];
            const expectedCheckin = '2021-04-05T15:00:00.000Z';
            const expectedCheckout = '2021-04-17T13:00:00.000Z';
            const res = await request(app)
                .post('/bookings')
                .send({
                    hotelId: expectedHotelId,
                    guests: expectedGuests,
                    checkin: '04-05-2021 12:00:00',
                    checkout: '04-17-2021 10:00:00',
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.hotelId).toBe(expectedHotelId);
            expect(res.body.guests).toEqual(expectedGuests);
            expect(res.body.checkin).toBe(expectedCheckin);
            expect(res.body.checkout).toBe(expectedCheckout);
            done();
        });

        it('should list all missing keys if incorrect body', async (done) => {
            const res = await request(app).post('/bookings').send({});
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Invalid keys: hotelId, guests, checkin, checkout');
            done();
        });

        it('should return status 500 with message error if an error occurred', async (done) => {
            const expectedHotelId = 'here:pds:place:840drt2z-da7d929da56241ab90a63e9b04581a3e';
            const expectedGuests = [
                {
                    name: 'More Persons 3',
                    document: '123456',
                },
                {
                    name: 'More Persons 4',
                    document: '987654',
                },
            ];
            await mongoose.connection.close(() => {});
            const res = await request(app)
                .post('/bookings')
                .send({
                    hotelId: expectedHotelId,
                    guests: expectedGuests,
                    checkin: '04-05-2021 12:00:00',
                    checkout: '04-17-2021 10:00:00',
                });
            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toBe('Error creating booking: server instance pool was destroyed');
            done();
        });
    });
});
