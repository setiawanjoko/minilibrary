/**
 * Generates a random hexadecimal string consisting of two random hexadecimal letters
 * followed by a four-digit number.
 *
 * @returns {string} A random hexadecimal string in the format "XXYYYY", where "XX"
 * represents two random hexadecimal letters (a-f) and "YYYY" represents a four-digit number.
 */
const generateRandomHex = () => {
  const letters = "abcdef"; // Hexadecimal letters
  const firstTwo =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)];
  const lastFour = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0"); // Ensures 4 digits
  return firstTwo + lastFour;
};

/**
 * Generates a URL-friendly slug from a given name.
 *
 * This function converts the input string to lowercase, replaces non-alphanumeric
 * characters with hyphens, and trims any leading or trailing hyphens.
 *
 * @param {string} name - The input string to be converted into a slug.
 * @returns {string} The generated slug.
 */
const generateSlug = async (name) => {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let uniqueSlug = slug;
  let counter = 1;

  while (!(await isUnique("slug", uniqueSlug))) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

/**
 * Checks if a value is unique in a specified column of the table.
 *
 * @async
 * @function isUnique
 * @param {string} column - The name of the column to check for uniqueness.
 * @param {string|number} value - The value to check for uniqueness in the specified column.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the value is unique, otherwise `false`.
 */
const isUnique = async (table, column, value) => {
  const query = `SELECT COUNT(*) FROM ${table} WHERE ${column} = $1`;
  const result = await pool.query(query, [value]);
  return parseInt(result.rows[0].count, 10) === 0;
};

/**
 * Generates a unique value for a specified column using a provided generator function.
 *
 * @async
 * @function
 * @param {string} column - The name of the column for which the unique value is being generated.
 * @param {Function} generator - A function that generates a candidate value.
 * @returns {Promise<*>} A promise that resolves to a unique value for the specified column.
 */
const generateUniqueValue = async (table, column, generator) => {
  let value;
  do {
    value = generator();
  } while (!(await isUnique(table, column, value)));
  return value;
};

const buildQueryWithFilters = (baseQuery, filters, pagination) => {
  const params = [];
  let query = baseQuery;

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query += ` AND ${key} ILIKE $${params.length + 1}`;
      params.push(`%${value}%`);
    }
  });

  if (pagination.limit) {
    query += ` LIMIT $${params.length + 1}`;
    params.push(pagination.limit);
  }

  if (pagination.offset) {
    query += ` OFFSET $${params.length + 2}`;
    params.push(pagination.offset);
  }

  return { query, params };
};

export {
  generateRandomHex,
  generateSlug,
  isUnique,
  generateUniqueValue,
  buildQueryWithFilters,
};
