exports.up = function(knex) {
  return knex.schema.createTable('logs', (table) => {
    table.increments('id').primary();
    table.string('action').notNullable(); // Description of the action (e.g., "GET /books")
    table.string('endpoint').notNullable(); // The endpoint that was hit (e.g., "/books")
    table.string('method').notNullable(); // HTTP method (e.g., "GET", "POST")
    table.integer('record_id').unsigned(); // Optional: ID of the record affected (if applicable)
    table.string('human_readable_note'); // Optional: Human-readable note about the action
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL'); // User who performed the action
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp of the action
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('logs');
};
