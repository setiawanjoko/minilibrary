
exports.up = function(knex) {
return knex.schema.createTable('events', function(table) {
    table.increments('id').primary();
    table.string('event_code').notNullable().unique();
    table.string('slug').notNullable().unique();
    table.string('name').notNullable();
    table.text('description');
    table.integer('location_id').unsigned().references('id').inTable('locations').onDelete('RESTRICT');
    table.dateTime('start_time').notNullable();
    table.dateTime('end_time');
    table.integer('promotor_id').unsigned().references('id').inTable('promotors').onDelete('RESTRICT');
    table.enu('status', ["active", "closed"]).defaultTo('active');
    table.enu('visibility', ["public", "private", "unlisted"]).defaultTo('unlisted');
    table.json('tags').defaultTo(JSON.stringify([]));
    table.string('image_url');
    table.string('timezone').defaultTo('UTC+7');
    table.string('currency').defaultTo('IDR');
    table.json('ticket_details').defaultTo(JSON.stringify([]));
    table.timestamps(true, true);
});
};

exports.down = function(knex) {
  return knex.schema.dropTable('events');
};
