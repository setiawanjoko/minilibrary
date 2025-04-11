/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('books').del();
  await knex('books').insert([
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', available: true },
    { title: '1984', author: 'George Orwell', available: true },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: true },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', available: true },
    { title: 'Pride and Prejudice', author: 'Jane Austen', available: true },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', available: true },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', available: true },
    { title: 'Moby-Dick', author: 'Herman Melville', available: true },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', available: true },
    { title: 'Brave New World', author: 'Aldous Huxley', available: true },
    { title: 'Animal Farm', author: 'George Orwell', available: true },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', available: true },
    { title: 'Wuthering Heights', author: 'Emily Brontë', available: true },
    { title: 'Frankenstein', author: 'Mary Shelley', available: true },
    { title: 'The Chronicles of Narnia', author: 'C.S. Lewis', available: true },
  ]);
};

