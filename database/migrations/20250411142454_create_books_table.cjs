exports.up = function(knex) {
    return knex.schema.createTable('books', (table) => {
      table.increments('id').primary();
      table.string('isbn').notNullable().unique();
      table.string('title').notNullable();
      table.string('author').notNullable();
      table.string('publisher').notNullable();
      table.date('published_date').notNullable();
      table.string('genre').notNullable();
      table.string('language').notNullable();
      table.string('description').notNullable();
      table.json('cover_image');
      table.boolean('available').defaultTo(true);
      table.integer('uploaded_by').unsigned().references('id').inTable('users').onDelete('SET NULL');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('books');
  };
  