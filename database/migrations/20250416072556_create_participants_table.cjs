
exports.up = function(knex) {
  return knex.schema.createTable('participants', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone');
    table.integer('event_id').unsigned().references('id').inTable('events').onDelete('RESTRICT');
    table.timestamps(true, true);
  }
  );
};

exports.down = function(knex) {
  return knex.schema.dropTable('participants');
};
