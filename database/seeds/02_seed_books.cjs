/**
 * Seed function to populate the 'books' table in the database.
 *
 * This function first deletes all existing entries in the 'books' table
 * and then inserts a predefined list of books into the table.
 *
 * @param {import('knex')} knex - The Knex.js instance used to interact with the database.
 * @returns {Promise<void>} A promise that resolves when the seeding operation is complete.
 */

const plainBooks = [
  {
    "isbn": "9780553418026",
    "title": "The Martian",
    "author": "Andy Weir",
    "publisher": "Crown Publishing Group",
    "published_date": "2014-02-11",
    "genre": "Science Fiction",
    "language": "English",
    "description": "A stranded astronaut must survive on Mars with limited resources."
  },
  {
    "isbn": "9780439139601",
    "title": "Harry Potter and the Goblet of Fire",
    "author": "J.K. Rowling",
    "publisher": "Scholastic",
    "published_date": "2000-07-08",
    "genre": "Fantasy",
    "language": "English",
    "description": "Harry competes in the dangerous Triwizard Tournament while uncovering dark secrets."
  },
  {
    "isbn": "9780007155668",
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "publisher": "HarperOne",
    "published_date": "1988-04-15",
    "genre": "Adventure",
    "language": "English",
    "description": "A shepherd's journey to discover his personal legend and treasure."
  },
  {
    "isbn": "9780451524935",
    "title": "1984",
    "author": "George Orwell",
    "publisher": "Signet Classics",
    "published_date": "1949-06-08",
    "genre": "Dystopian",
    "language": "English",
    "description": "A chilling depiction of a totalitarian regime and its impact on society."
  },
  {
    "isbn": "9780743273565",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publisher": "Scribner",
    "published_date": "1925-04-10",
    "genre": "Classic",
    "language": "English",
    "description": "A critique of the American Dream set in the Roaring Twenties."
  },
  {
    "isbn": "9780316769488",
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "publisher": "Little, Brown and Company",
    "published_date": "1951-07-16",
    "genre": "Fiction",
    "language": "English",
    "description": "A teenager's journey through New York City as he struggles with alienation."
  },
  {
    "isbn": "9780007458424",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "publisher": "Houghton Mifflin Harcourt",
    "published_date": "1937-09-21",
    "genre": "Fantasy",
    "language": "English",
    "description": "Bilbo Baggins embarks on an epic quest to reclaim a treasure guarded by a dragon."
  },
  {
    "isbn": "9780593189641",
    "title": "Atomic Habits",
    "author": "James Clear",
    "publisher": "Gramedia Pustaka Utama",
    "published_date": "2020-03-09",
    "genre": "Self Development",
    "language": "English",
    "description": "A practical guide to building good habits and breaking bad ones."
  },
  {
    "isbn": "9789793062792",
    "title": "Laskar Pelangi",
    "author": "Andrea Hirata",
    "publisher": "Bentang Pustaka",
    "published_date": "2005-08-31T17:00:00.000Z",
    "genre": "Fiksi",
    "language": "Indonesian",
    "description": "Kisah inspiratif tentang anak-anak dari keluarga miskin yang berjuang demi pendidikan di Belitung.",
  },
  {
    "isbn": "9786024246945",
    "title": "Laut Bercerita",
    "author": "Leila S. Chudori",
    "publisher": "Kepustakaan Populer Gramedia",
    "published_date": "2017-09-30T17:00:00.000Z",
    "genre": "Sejarah",
    "language": "Indonesian",
    "description": "Novel berlatar sejarah aktivisme mahasiswa pada masa Orde Baru yang hilang secara misterius.",
  },
  {
    "isbn": "9786020301129",
    "title": "Bumi",
    "author": "Tere Liye",
    "publisher": "Gramedia Pustaka Utama",
    "published_date": "2013-12-31T17:00:00.000Z",
    "genre": "Fantasi",
    "language": "Indonesian",
    "description": "Petualangan seru Raib dan teman-temannya di dunia paralel yang penuh rahasia dan kekuatan luar biasa.",
  },
  {
    "isbn": "9780099590088",
    "title": "Sapiens: A Brief History of Humankind",
    "author": "Yuval Noah Harari",
    "publisher": "Gramedia Pustaka Utama",
    "published_date": "2018-05-20T17:00:00.000Z",
    "genre": "Sejarah",
    "language": "English",
    "description": "Penelusuran sejarah manusia dari zaman purba hingga era modern.",
  }
]

exports.seed = async function(knex) {
  await knex('books').del();
  const books = await Promise.all(
    plainBooks.map(async (book) => ({
      ...book,
      cover_image: JSON.stringify({
        small: `https://covers.openlibrary.org/b/isbn/${book.isbn}-S.jpg`,
        medium: `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`,
        large: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
      }),
      uploaded_by: 1,
    }))
  );
  await knex('books').insert(books);
};

