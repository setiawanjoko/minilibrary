exports.up = function (knex) {
  return knex.schema.createTable("reading_lists", function (table) {
    table.increments("id").primary();
    table.integer("book_id").unsigned().notNullable();
    table.foreign("book_id").references("books.id").onDelete("CASCADE");
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table.enu("status", ["reading", "completed", "dropped", "read later"]).defaultTo("reading");
    table.timestamps(true, true);
    table.timestamp("deleted_at").nullable();
    table.index(["user_id", "book_id"], "reading_lists_user_book_index");
  });
};

exports.down = function (knex) {
    return knex.schema.dropTable("reading_lists");
};
