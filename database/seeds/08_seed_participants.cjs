

/**
 * Seed file for populating the "participants" table in the database.
 * 
 * This file contains a list of participants for various events, including their
 * personal details, ticket information, and payment status. The seed function
 * clears the existing entries in the "participants" table and inserts the new
 * data.
 * 
 * @file 08_seed_participants.cjs
 * @module seeds/08_seed_participants
 * 
 * @constant {Array<Object>} participants - Array of participant objects.
 * @property {number} participants.id - Unique identifier for the participant.
 * @property {string} participants.name - Name of the participant.
 * @property {string} participants.email - Email address of the participant.
 * @property {string} participants.phone - Phone number of the participant.
 * @property {number} participants.event_id - ID of the event the participant is attending.
 * @property {string} participants.ticket_code - Unique code for the participant's ticket.
 * @property {string} participants.ticket_type - Type of ticket purchased (e.g., VIP, General).
 * @property {string} participants.ticket_price - Price of the ticket.
 * @property {string} participants.payment_status - Payment status of the ticket (e.g., "paid").
 * @property {Date} participants.created_at - Timestamp when the participant entry was created.
 * @property {Date} participants.updated_at - Timestamp when the participant entry was last updated.
 * 
 * @function seed
 * @async
 * @param {Object} knex - Knex.js database connection instance.
 * @returns {Promise<void>} Resolves when the seeding operation is complete.
 * 
 * @example
 * // Run the seed file using Knex.js CLI
 * npx knex seed:run --specific=08_seed_participants.cjs
 */

const participants = [
  // Event 1: London Music Festival
  {
    id: 1,
    name: "Alice",
    email: "alice@mail.com",
    phone: "1234567890",
    event_id: 1,
    ticket_code: "TCK001",
    ticket_type: "VIP",
    ticket_price: "100",
    payment_status: "paid",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@mail.com",
    phone: "1234567891",
    event_id: 1,
    ticket_code: "TCK002",
    ticket_type: "General",
    ticket_price: "50",
    payment_status: "paid",
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Event 2: Manchester Tech Conference
  {
    id: 3,
    name: "Charlie",
    email: "charlie@mail.com",
    phone: "1234567892",
    event_id: 2,
    ticket_code: "TCK003",
    ticket_type: "Standard",
    ticket_price: "75",
    payment_status: "paid",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    name: "David",
    email: "david@mail.com",
    phone: "1234567893",
    event_id: 2,
    ticket_code: "TCK004",
    ticket_type: "Student",
    ticket_price: "30",
    payment_status: "paid",
    created_at: new Date(),
    updated_at: new Date(),
  },

  // Event 3: Edinburgh Art Exhibition
  {
    id: 5,
    name: "Eve",
    email: "eve@mail.com",
    phone: "1234567894",
    event_id: 3,
    ticket_code: "TCK005",
    ticket_type: "Adult",
    ticket_price: "20",
    payment_status: "paid",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    name: "Frank",
    email: "frank@mail.com",
    phone: "1234567895",
    event_id: 3,
    ticket_code: "TCK006",
    ticket_type: "Child",
    ticket_price: "10",
    payment_status: "paid",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("participants").del();
  // Inserts seed entries
  await knex("participants").insert(participants);
};
