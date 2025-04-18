/**
 * Seeds the `events` table in the database with predefined event data.
 *
 * @fileoverview This script defines a set of event records and inserts them
 * into the `events` table using Knex.js. Each event includes details such as
 * event code, name, description, location, timing, promotor, status, visibility,
 * tags, image URL, timezone, currency, and ticket details.
 *
 * @module seeds/07_seed_events
 *
 * @typedef {Object} Event
 * @property {number} id - Unique identifier for the event.
 * @property {string} event_code - Unique code for the event.
 * @property {string} slug - URL-friendly identifier for the event.
 * @property {string} name - Name of the event.
 * @property {string} description - Description of the event.
 * @property {number} location_id - Identifier for the event's location.
 * @property {Date} start_time - Start time of the event.
 * @property {Date} end_time - End time of the event.
 * @property {number} promotor_id - Identifier for the event's promotor.
 * @property {string} status - Status of the event (e.g., 'active').
 * @property {string} visibility - Visibility of the event (e.g., 'public', 'private', 'unlisted').
 * @property {string} tags - JSON stringified array of tags associated with the event.
 * @property {string} image_url - URL of the event's image.
 * @property {string} timezone - Timezone of the event.
 * @property {string} currency - Currency used for ticket pricing.
 * @property {string} ticket_details - JSON stringified array of ticket types and prices.
 * @property {Date} created_at - Timestamp when the event was created.
 * @property {Date} updated_at - Timestamp when the event was last updated.
 *
 * @function seed
 * @async
 * @param {import('knex')} knex - Knex.js instance for database operations.
 * @description Deletes all existing entries in the `events` table and inserts
 * predefined event data.
 */

const events = [
    {
        id: 1,
        event_code: 'EVT001',
        slug: 'music-festival-london',
        name: 'London Music Festival',
        description: 'A grand music festival featuring top artists.',
        location_id: 1,
        start_time: new Date('2025-05-01T18:00:00'),
        end_time: new Date('2025-05-01T23:00:00'),
        promotor_id: 1,
        status: 'active',
        visibility: 'public',
        tags: JSON.stringify(['music', 'festival', 'live']),
        image_url: 'https://example.com/images/music-festival-london.jpg',
        timezone: 'UTC+1',
        currency: 'GBP',
        ticket_details: JSON.stringify([{ type: 'VIP', price: 100 }, { type: 'General', price: 50 }]),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 2,
        event_code: 'EVT002',
        slug: 'tech-conference-manchester',
        name: 'Manchester Tech Conference',
        description: 'A conference for tech enthusiasts and professionals.',
        location_id: 2,
        start_time: new Date('2025-06-15T09:00:00'),
        end_time: new Date('2025-06-15T17:00:00'),
        promotor_id: 2,
        status: 'active',
        visibility: 'private',
        tags: JSON.stringify(['technology', 'conference', 'networking']),
        image_url: 'https://example.com/images/tech-conference-manchester.jpg',
        timezone: 'UTC+1',
        currency: 'GBP',
        ticket_details: JSON.stringify([{ type: 'Standard', price: 75 }, { type: 'Student', price: 30 }]),
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 3,
        event_code: 'EVT003',
        slug: 'art-exhibition-edinburgh',
        name: 'Edinburgh Art Exhibition',
        description: 'An exhibition showcasing contemporary art.',
        location_id: 4,
        start_time: new Date('2025-07-10T10:00:00'),
        end_time: new Date('2025-07-10T18:00:00'),
        promotor_id: 4,
        status: 'active',
        visibility: 'unlisted',
        tags: JSON.stringify(['art', 'exhibition', 'culture']),
        image_url: 'https://example.com/images/art-exhibition-edinburgh.jpg',
        timezone: 'UTC+1',
        currency: 'GBP',
        ticket_details: JSON.stringify([{ type: 'Adult', price: 20 }, { type: 'Child', price: 10 }]),
        created_at: new Date(),
        updated_at: new Date(),
    },
];

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('events').del();
    // Inserts seed entries
    await knex('events').insert(events);
};