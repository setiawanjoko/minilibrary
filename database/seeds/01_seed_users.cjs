const bcrypt = require('bcrypt')

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {name: 'Admin', email: 'admin@mail.com', password: await bcrypt.hash('password', 10)},
    {name: 'Alice', email: 'alice@mail.com', password: await bcrypt.hash('password', 10)},
    {name: 'Bob', email: 'bob@mail.com', password: await bcrypt.hash('password', 10)},
    {name: 'Charlie', email: 'charlie@mail.com', password: await bcrypt.hash('password', 10)}
  ]);
};