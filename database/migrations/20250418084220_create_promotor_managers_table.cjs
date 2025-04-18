/**
 * Migration script to create and drop the "promotor_managers" table.
 *
 * @module migrations/20250418084220_create_promotor_managers_table
 */

/**
 * Runs the migration to create the "promotor_managers" table.
 *
 * The table includes the following columns:
 * - `id`: Primary key, auto-incrementing integer.
 * - `promotor_id`: Foreign key referencing the `id` column in the "promotors" table. Cannot be null. Restricts deletion.
 * - `manager_id`: Foreign key referencing the `id` column in the "users" table. Cannot be null. Restricts deletion.
 * - `permissions`: JSON column with default value `["read"]`.
 * - `status`: Enum column with values "active" and "inactive", defaulting to "active".
 * - Timestamps: Automatically managed `created_at` and `updated_at` columns.
 *
 * @param {import('knex')} knex - The Knex.js database connection instance.
 * @returns {Promise<void>} A promise that resolves when the table is created.
 */

exports.up = function (knex) {
  return knex.schema.createTable("promotor_managers", function (table) {
    table.increments("id").primary();
    table
      .integer("promotor_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("promotors")
      .onDelete("RESTRICT");
    table
      .integer("manager_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT");
    table.json("permissions").defaultTo(JSON.stringify(["read"]));
    table.enu("status", ["active", "inactive"]).defaultTo("active");
    table.timestamps(true, true);
  });
};

/**
 * Rolls back the migration by dropping the "promotor_managers" table.
 *
 * @param {import('knex')} knex - The Knex.js database connection instance.
 * @returns {Promise<void>} A promise that resolves when the table is dropped.
 */

exports.down = function (knex) {
  return knex.schema.dropTable("promotor_managers");
};
