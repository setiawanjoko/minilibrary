
exports.up = function(knex) {
return knex.schema.createTable('events', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('location_id').unsigned().references('id').inTable('locations').onDelete('RESTRICT');
    table.dateTime('start_time').notNullable();
    table.dateTime('end_time');
    table.timestamps(true, true);
});
};

exports.down = function(knex) {
  return knex.schema.dropTable('events');
};
