jest.mock('axios');

const { default: axios } = require('axios');
const request = require('supertest');
const app = require('../../app');

beforeAll(() => {
    axios.get = jest.fn();
});

beforeEach(() => {
    axios.get.mockReturnValue(Promise.resolve({ data: [] }));
});

describe('HotelsRoutes', () => {
    describe('hotels', () => {
        it('should validate query params', async (done) => {
            const res = await request(app).get('/hotels');
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Invalid params: latlng, r');
            done();
        });

        it('should use max radius value when value exceeds 5000', async (done) => {
            const res = await request(app).get('/hotels?latlng=12.33,45.99&r=5001');
            expect(res.statusCode).toBe(200);
            expect(axios.get).toHaveBeenCalledWith('https://discover.search.hereapi.com/v1/discover?apiKey=undefined&q=hotels&in=circle:12.33,45.99;r=5000');
            done();
        });

        it('should use min radius value when value is less than 100', async (done) => {
            const res = await request(app).get('/hotels?latlng=12.33,45.99&r=0');
            expect(res.statusCode).toEqual(200);
            expect(axios.get).toHaveBeenCalledWith('https://discover.search.hereapi.com/v1/discover?apiKey=undefined&q=hotels&in=circle:12.33,45.99;r=100');
            done();
        });

        it('should return status 500 with message error if an error occurred', async (done) => {
            axios.get.mockImplementation(() => {
                throw new Error('This is a test.');
            });
            const res = await request(app).get('/hotels?latlng=12.33,45.99&r=0');
            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toBe('Error getting nearby hotels: This is a test.');
            done();
        });
    });
});
