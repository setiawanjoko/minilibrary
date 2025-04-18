/**
 * @file 01_seed_users.cjs
 * @description This file contains a seed script for populating the `users` table in the database with initial data.
 * It uses bcrypt to hash passwords for each user before inserting them into the database.
 */

const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Define users with plain text passwords
  const plainUsers = [
    { name: 'Admin', email: 'admin@mail.com', password: 'password' },
    { name: 'Alice', email: 'alice@mail.com', password: 'password' },
    { name: 'Bob', email: 'bob@mail.com', password: 'password' },
    { name: 'Charlie', email: 'charlie@mail.com', password: 'password' },
    { name: 'David', email: 'david@mail.com', password: 'password' },
    { name: 'Eve', email: 'eve@mail.com', password: 'password' },
    { name: 'Frank', email: 'frank@mail.com', password: 'password' },
    { name: 'Grace', email: 'grace@mail.com', password: 'password' },
    { name: 'Hank', email: 'hank@mail.com', password: 'password' },
    { name: 'Ivy', email: 'ivy@mail.com', password: 'password' },
    { name: 'Jack', email: 'jack@mail.com', password: 'password' },
    { name: 'Karen', email: 'karen@mail.com', password: 'password' },
    { name: 'Leo', email: 'leo@mail.com', password: 'password' },
    { name: 'Mona', email: 'mona@mail.com', password: 'password' },
    { name: 'Nina', email: 'nina@mail.com', password: 'password' },
    { name: 'Oscar', email: 'oscar@mail.com', password: 'password' },
    { name: 'Paul', email: 'paul@mail.com', password: 'password' },
    { name: 'Quinn', email: 'quinn@mail.com', password: 'password' },
    { name: 'Rita', email: 'rita@mail.com', password: 'password' },
    { name: 'Steve', email: 'steve@mail.com', password: 'password' },
  ];

  // Hash passwords
  const users = await Promise.all(
    plainUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  // Inserts seed entries
  await knex('users').insert(users);
};