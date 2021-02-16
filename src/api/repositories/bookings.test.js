const BookingRepository = require('./bookings');

beforeAll(() => {
    const mockedModel = jest.fn();
    this.bookingsRepository = new BookingRepository(mockedModel);
});

describe('BookingRepository', () => {
    describe('list', () => {
        it('should list all bookings sanitized', async () => {
            this.bookingsRepository
                .model
                .countDocuments = jest.fn().mockReturnValue(Promise.resolve(1));
            this.bookingsRepository
                .model
                .find = jest.fn().mockReturnValue(Promise.resolve([{
                    hotelId: '123',
                    guests: [{
                        name: 'Test1',
                        document: '456789123',
                    }],
                    checkin: '2021-04-05T15:00:00.000Z',
                    checkout: '2021-04-07T13:00:00.000Z',
                    uselessfield: '1',
                    uselessfield2: '2',
                    uselessfield3: '3',
                    uselessfield4: '4',
                }]));
            const bookings = await this.bookingsRepository.list({});
            expect(bookings.total).toBe(1);
            expect(bookings.size).toBe(20);
            expect(bookings.currentPage).toBe(1);
            expect(bookings.list).toEqual([{
                hotelId: '123',
                guests: [{
                    name: 'Test1',
                    document: '456789123',
                }],
                checkin: '2021-04-05T15:00:00.000Z',
                checkout: '2021-04-07T13:00:00.000Z',
            }]);
        });
    });

    describe('create', () => {
        it('should create and return the booking sanitized', async () => {
            this.bookingsRepository
                .model
                .create = jest.fn().mockReturnValue(Promise.resolve({
                    hotelId: '123',
                    guests: [{
                        name: 'Test1',
                        document: '456789123',
                    }],
                    checkin: '2021-04-05T15:00:00.000Z',
                    checkout: '2021-04-07T13:00:00.000Z',
                    uselessfield: '1',
                    uselessfield2: '2',
                    uselessfield3: '3',
                    uselessfield4: '4',
                }));
            const mockedData = {
                hotelId: '123',
                guests: [{
                    name: 'Test1',
                    document: '456789123',
                }],
                checkin: '2021-04-05T15:00:00.000Z',
                checkout: '2021-04-07T13:00:00.000Z',
            };
            const expectedData = {
                hotelId: '123',
                guests: [{
                    name: 'Test1',
                    document: '456789123',
                }],
                checkin: new Date('2021-04-05T15:00:00.000Z'),
                checkout: new Date('2021-04-07T13:00:00.000Z'),
            };
            const booking = await this.bookingsRepository.create(mockedData);
            expect(this.bookingsRepository.model.create).toHaveBeenCalledWith(expectedData);
            expect(booking).toEqual({
                hotelId: '123',
                guests: [{
                    name: 'Test1',
                    document: '456789123',
                }],
                checkin: '2021-04-05T15:00:00.000Z',
                checkout: '2021-04-07T13:00:00.000Z',
            });
        });
    });
});
