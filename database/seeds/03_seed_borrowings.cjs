/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('borrowings').del();
  await knex('borrowings').insert([
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
  ]);
};

