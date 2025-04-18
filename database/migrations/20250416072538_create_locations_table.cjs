/**
 * locations table
 * - id: primary key
 * - address: string, not nullable
 * - city: string, not nullable
 * - state: string, not nullable
 * - zip_code: string, not nullable
 * - country: string, not nullable
 * - latitude: float, nullable
 * - longitude: float, nullable
 * - created_at: timestamp, default to current timestamp
 */

exports.up = function(knex) {
  return knex.schema.createTable('locations', function(table) {
    table.increments('id').primary();
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
