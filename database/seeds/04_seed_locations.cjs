/**
 * Seeds the `locations` table in the database with predefined data.
 *
 * The `locations` table contains the following columns:
 * - `id` (integer): Primary key, unique identifier for each location.
 * - `name` (string): The name of the location, not nullable.
 * - `address` (string): The address of the location, not nullable.
 * - `city` (string): The city where the location is situated, not nullable.
 * - `state` (string): The state or region of the location, not nullable.
 * - `zip_code` (string): The postal code of the location, not nullable.
 * - `country` (string): The country of the location, not nullable.
 * - `latitude` (float): The latitude coordinate of the location, nullable.
 * - `longitude` (float): The longitude coordinate of the location, nullable.
 * - `created_at` (timestamp): The timestamp when the record was created, defaults to the current timestamp.
 *
 * @param {import('knex')} knex - The Knex.js database connection instance.
 * @returns {Promise<void>} A promise that resolves when the seeding is complete.
 */

const locations = [
    {
        id: 1,
        name: 'Prime Minister Residence',
        address: '10 Downing Street',
        city: 'London',
        state: 'England',
        zip_code: 'SW1A 2AA',
        country: 'UK',
        latitude: 51.5034,
        longitude: -0.1276,
    },
    {
        id: 2,
        name: 'Old Trafford Stadium',
        address: 'Old Trafford',
        city: 'Manchester',
        state: 'England',
        zip_code: 'M16 0RA',
        country: 'UK',
        latitude: 53.4631,
        longitude: -2.2913,
    },
    {
        id: 3,
        name: 'Victoria Square',
        address: 'Victoria Square',
        city: 'Birmingham',
        state: 'England',
        zip_code: 'B1 1BB',
        country: 'UK',
        latitude: 52.4797,
        longitude: -1.9020,
    },
    {
        id: 4,
        name: 'Royal Mile',
        address: 'Royal Mile',
        city: 'Edinburgh',
        state: 'Scotland',
        zip_code: 'EH1 1QS',
        country: 'UK',
        latitude: 55.9502,
        longitude: -3.1875,
    },
    {
        id: 5,
        name: 'George Square',
        address: 'George Square',
        city: 'Glasgow',
        state: 'Scotland',
        zip_code: 'G2 1DU',
        country: 'UK',
        latitude: 55.8609,
        longitude: -4.2514,
    },
    {
        id: 6,
        name: 'Albert Dock',
        address: 'Albert Dock',
        city: 'Liverpool',
        state: 'England',
        zip_code: 'L3 4AA',
        country: 'UK',
        latitude: 53.3995,
        longitude: -2.9910,
    },
    {
        id: 7,
        name: 'Cardiff Castle',
        address: 'Cardiff Castle',
        city: 'Cardiff',
        state: 'Wales',
        zip_code: 'CF10 3RB',
        country: 'UK',
        latitude: 51.4817,
        longitude: -3.1812,
    },
    {
        id: 8,
        name: 'Belfast City Hall',
        address: 'Belfast City Hall',
        city: 'Belfast',
        state: 'Northern Ireland',
        zip_code: 'BT1 5GS',
        country: 'UK',
        latitude: 54.5964,
        longitude: -5.9306,
    },
    {
        id: 9,
        name: 'Stonehenge',
        address: 'Stonehenge',
        city: 'Salisbury',
        state: 'England',
        zip_code: 'SP4 7DE',
        country: 'UK',
        latitude: 51.1789,
        longitude: -1.8262,
    },
    {
        id: 10,
        name: 'Oxford University',
        address: 'Oxford University',
        city: 'Oxford',
        state: 'England',
        zip_code: 'OX1 2JD',
        country: 'UK',
        latitude: 51.7548,
        longitude: -1.2544,
    },
];

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('locations').del();
    // Inserts seed entries
    await knex('locations').insert(locations);
};