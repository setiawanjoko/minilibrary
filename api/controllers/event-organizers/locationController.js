import pool from "../../../db.js"; // Database pool configuration
import { successResponse, errorResponse } from "../../../utils/responseHandler.js"; // Unified response handler

const DEFAULT_PAGINATION = {
  LIMIT: 10,
  OFFSET: 0,
};

const getLocationById = async (id) => {
  const query = `
    SELECT id, name, address, city, state, country, zip_code, latitude, longitude
    FROM locations
    WHERE id = $1 AND deleted_at IS NULL`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

/**
 * Retrieves all locations with optional pagination and filtering.
 * Query parameters: limit, offset, name (for filtering by location name).
 */
export const getLocations = async (req, res) => {
  try {
    const { limit = DEFAULT_PAGINATION.LIMIT, offset = DEFAULT_PAGINATION.OFFSET, name } = req.query;

    const params = [];
    let query = `
      SELECT id, name, address, city, state, country, zip_code
      FROM locations
      WHERE deleted_at IS NULL`;

    if (name) {
      query += ` AND name ILIKE $${params.length + 1}`;
      params.push(`%${name}%`);
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    successResponse(res, {
      locations: result.rows,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    }, `Successfully retrieved ${result.rows.length} location(s).`);
  } catch (error) {
    errorResponse(res, error, 500);
  }
};

/**
 * Retrieves a single location by ID.
 */
export const getLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await getLocationById(id);

    if (!location) {
      return errorResponse(res, { message: `Location with ID ${id} not found.` }, 404);
    }

    successResponse(res, location, `Location with ID ${id} retrieved successfully.`);
  } catch (error) {
    errorResponse(res, error, 500);
  }
};

/**
 * Adds a new location to the database.
 */
export const addLocation = async (req, res) => {
  try {
    const { name, address, city, state, country, zip_code, latitude, longitude } = req.body;

    const query = `
      INSERT INTO locations (name, address, city, state, country, zip_code, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`;
    const result = await pool.query(query, [name, address, city, state, country, zip_code, latitude, longitude]);

    successResponse(res, result.rows[0], `Location '${name}' added successfully.`, 201);
  } catch (error) {
    errorResponse(res, error, 500);
  }
};

/**
 * Updates an existing location by ID.
 * Only updates the fields provided in the request body.
 */
export const editLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    // Dynamically build the query and parameters
    const updates = [];
    const params = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(fields)) {
      updates.push(`${key} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    }

    if (updates.length === 0) {
      return errorResponse(res, { message: "No fields provided for update." }, 400);
    }

    params.push(id);

    const query = `
      UPDATE locations
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *`;
    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return errorResponse(res, { message: `Location with ID ${id} not found or already deleted.` }, 404);
    }

    successResponse(res, result.rows[0], `Location with ID ${id} updated successfully.`);
  } catch (error) {
    errorResponse(res, error, 500);
  }
};

/**
 * Soft deletes a location by setting the deleted_at timestamp.
 */
export const deleteLocation = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const query = `
      UPDATE locations
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *`;
    const result = await client.query(query, [id]);

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return errorResponse(res, { message: `Location with ID ${id} not found or already deleted.` }, 404);
    }

    await client.query("COMMIT");
    successResponse(res, result.rows[0], `Location with ID ${id} soft deleted successfully.`);
  } catch (error) {
    await client.query("ROLLBACK");
    errorResponse(res, error, 500);
  } finally {
    client.release();
  }
};