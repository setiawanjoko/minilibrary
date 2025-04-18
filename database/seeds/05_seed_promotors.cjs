
/**
 * Seed file for populating the 'promotors' table in the database.
 * 
 * This file defines a list of promotors with their respective details and inserts them into the database.
 * Each promotor object contains information such as ID, code, slug, image URL, website URL, name, description,
 * contact details, location ID, status, and timestamps.
 * 
 * @file 05_seed_promotors.cjs
 * @module seeds/05_seed_promotors
 * 
 * @requires knex - The Knex.js query builder for interacting with the database.
 * 
 * @constant {Array<Object>} promotors - Array of promotor objects to be seeded into the database.
 * @property {number} promotors.id - Unique identifier for the promotor.
 * @property {string} promotors.promotor_code - Unique code for the promotor.
 * @property {string} promotors.slug - URL-friendly identifier for the promotor.
 * @property {string} promotors.image_url - URL of the promotor's image.
 * @property {string} promotors.website_url - URL of the promotor's website.
 * @property {string} promotors.name - Name of the promotor.
 * @property {string} promotors.description - Description of the promotor.
 * @property {string} promotors.contact_person - Name of the contact person for the promotor.
 * @property {string} promotors.contact_person_position - Position of the contact person.
 * @property {string} promotors.contact_person_phone - Phone number of the contact person.
 * @property {string} promotors.contact_person_email - Email address of the contact person.
 * @property {number} promotors.location_id - ID of the location associated with the promotor.
 * @property {string} promotors.status - Status of the promotor (e.g., 'active').
 * @property {Date} promotors.created_at - Timestamp of when the promotor was created.
 * @property {Date} promotors.updated_at - Timestamp of when the promotor was last updated.
 * 
 * @function seed
 * @async
 * @description Deletes all existing entries in the 'promotors' table and inserts the defined promotors.
 * @param {Object} knex - The Knex.js instance for database interaction.
 * @returns {Promise<void>} A promise that resolves when the seeding operation is complete.
 */
const promotors = [
    {
        id: 1,
        promotor_code: 'PROM001',
        slug: 'promotor-london',
        image_url: 'https://example.com/images/promotor-london.jpg',
        website_url: 'https://promotorlondon.com',
        name: 'London Events Ltd.',
        description: 'Leading event organizer in London.',
        contact_person: 'John Doe',
        contact_person_position: 'Manager',
        contact_person_phone: '+441234567890',
        contact_person_email: 'john.doe@londonevents.com',
        location_id: 1,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 2,
        promotor_code: 'PROM002',
        slug: 'promotor-manchester',
        image_url: 'https://example.com/images/promotor-manchester.jpg',
        website_url: 'https://promotormanchester.com',
        name: 'Manchester Promotions',
        description: 'Top-notch event management in Manchester.',
        contact_person: 'Jane Smith',
        contact_person_position: 'Director',
        contact_person_phone: '+441612345678',
        contact_person_email: 'jane.smith@manchesterpromotions.com',
        location_id: 2,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 3,
        promotor_code: 'PROM003',
        slug: 'promotor-birmingham',
        image_url: 'https://example.com/images/promotor-birmingham.jpg',
        website_url: 'https://promotorbirmingham.com',
        name: 'Birmingham Event Co.',
        description: 'Specializing in corporate events in Birmingham.',
        contact_person: 'Alice Johnson',
        contact_person_position: 'Event Coordinator',
        contact_person_phone: '+441212345678',
        contact_person_email: 'alice.johnson@birminghamevents.com',
        location_id: 3,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 4,
        promotor_code: 'PROM004',
        slug: 'promotor-edinburgh',
        image_url: 'https://example.com/images/promotor-edinburgh.jpg',
        website_url: 'https://promotoredinburgh.com',
        name: 'Edinburgh Festivals',
        description: 'Organizing cultural festivals in Edinburgh.',
        contact_person: 'Robert Brown',
        contact_person_position: 'Festival Director',
        contact_person_phone: '+441313456789',
        contact_person_email: 'robert.brown@edinburghfestivals.com',
        location_id: 4,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 5,
        promotor_code: 'PROM005',
        slug: 'promotor-glasgow',
        image_url: 'https://example.com/images/promotor-glasgow.jpg',
        website_url: 'https://promotorglasgow.com',
        name: 'Glasgow Event Planners',
        description: 'Experts in planning large-scale events in Glasgow.',
        contact_person: 'Emily Davis',
        contact_person_position: 'Operations Manager',
        contact_person_phone: '+441414567890',
        contact_person_email: 'emily.davis@glasgowevents.com',
        location_id: 5,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
    },
];


exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('promotors').del();
    // Inserts seed entries
    await knex('promotors').insert(promotors);
};