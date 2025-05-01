/**
 * promotors table migration
 * - id: primary key
 * - promotor_code: string, not nullable, unique
 * - slug: string, not nullable, unique
 * - image_url: string, nullable
 * - website_url: string, nullable
 * - name: string, not nullable
 * - description: string, nullable
 * - contact_person: string, nullable
 * - contact_person_position: string, nullable
 * - contact_person_phone: string, unique, nullable
 * - contact_person_email: string, unique, nullable
 * - location_id: foreign key, references locations(id), on delete restrict
 * - created_at: timestamp, default to current timestamp
 * - updated_at: timestamp, default to current timestamp
 * - deleted_at: timestamp, nullable (for soft deletes)
 */

exports.up = function (knex) {
  return knex.schema.createTable("promotors", function (table) {
    table.increments("id").primary();
    table.string("promotor_code").notNullable().unique();
    table.string("slug").notNullable().unique();
    table.string("image_url");
    table.string("website_url");
    table.string("name").notNullable();
    table.string("description");
    table.string("contact_person");
    table.string("contact_person_position");
    table.string("contact_person_phone").unique();
    table.string("contact_person_email").unique();
    table
      .integer("location_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("locations")
      .onDelete("RESTRICT");
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable(); // For soft delete
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("promotors");
};
