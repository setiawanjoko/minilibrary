/**
 * Seed data for the 'borrowings' table in the database.
 * 
 * This script defines an array of borrowing records, each representing
 * a borrowing transaction with details such as the user who borrowed
 * the book, the book borrowed, the borrowing date, and the return date.
 * 
 * @constant {Array<Object>} borrowings - Array of borrowing records.
 * @property {number} borrowings[].user_id - The ID of the user who borrowed the book.
 * @property {number} borrowings[].book_id - The ID of the book that was borrowed.
 * @property {Date} borrowings[].borrowed_at - The date and time when the book was borrowed.
 * @property {Date|null} borrowings[].returned_at - The date and time when the book was returned, or null if not yet returned.
 * 
 * @function seed
 * @async
 * @description Seeds the 'borrowings' table by first clearing all existing data
 * and then inserting the predefined borrowing records.
 * 
 * @param {Object} knex - The Knex.js database connection instance.
 * @returns {Promise<void>} A promise that resolves when the seeding is complete.
 */

const borrowings = [
  {
    user_id: 1,
    book_id: 3,
    borrowed_at: new Date('2024-12-01T10:00:00Z'),
    returned_at: new Date('2025-01-01T10:00:00Z'),
  },
  {
    user_id: 2,
    book_id: 5,
    borrowed_at: new Date('2025-01-15T14:00:00Z'),
    returned_at: null,
  },
  {
    user_id: 1,
    book_id: 7,
    borrowed_at: new Date('2025-02-10T08:30:00Z'),
    returned_at: new Date('2025-03-01T08:30:00Z'),
  },
  {
    user_id: 3,
    book_id: 2,
    borrowed_at: new Date('2025-03-20T11:45:00Z'),
    returned_at: null,
  },
  {
    user_id: 1,
    book_id: 10,
    borrowed_at: new Date('2025-04-01T16:20:00Z'),
    returned_at: null,
  },
]

exports.seed = async function(knex) {
  await knex('borrowings').del();
  //await knex('borrowings').insert(borrowings);
};

