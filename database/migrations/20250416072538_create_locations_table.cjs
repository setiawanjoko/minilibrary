
exports.up = function(knex) {
  return knex.schema.createTable('locations', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('zip_code').notNullable();
    table.string('country').notNullable();
    table.float('latitude');
    table.float('longitude');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('locations');
};
