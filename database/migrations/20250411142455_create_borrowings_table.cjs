exports.up = function(knex) {
    return knex.schema.createTable('borrowings', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('book_id').unsigned().references('id').inTable('books').onDelete('CASCADE');
      table.timestamp('borrowed_at').defaultTo(knex.fn.now());
      table.timestamp('returned_at').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('borrowings');
  };
  