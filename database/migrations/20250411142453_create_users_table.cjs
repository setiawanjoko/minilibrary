exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.string('phone').notNullable().unique();
      table.enu('permission', ['admin', 'user']).defaultTo('user');
      table.timestamp('last_login_at').nullable();
      table.timestamp('last_logout_at').nullable();
      table.string('refresh_token').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  