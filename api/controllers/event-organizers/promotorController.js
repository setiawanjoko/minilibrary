import pool from "../../../db.js"; // Assuming a database pool is configured
import { successResponse, errorResponse } from "../../../utils/responseHandler.js"; // Response handler
import { handleDatabaseError, handleAuthError } from "../../../utils/errorHandler.js"; // Error handler
import { generateUniqueValue, generateRandomHex, generateSlug } from "../../../utils/helpers.js"; // Utilities
import { STATUS_CODES } from "../../../utils/constants.js";

/**
 * Helper function to check user permissions for a promotor.
 * @param {string} identifier - The promotor_code or slug.
 * @param {number} userId - The ID of the logged-in user.
 * @param {string} requiredPermission - The required permission (e.g., "write", "delete").
 * @throws {Error} If the user does not have the required permission.
 */
const checkUserPermission = async (identifier, userId, requiredPermission) => {
  const query = `
    SELECT pm.permission
    FROM promotor_managers pm
    INNER JOIN promotors p ON pm.promotor_id = p.id
    WHERE (p.promotor_code = $1 OR p.slug = $1)
      AND pm.manager_id = $2
      AND pm.status = 'active'
      AND p.deleted_at IS NULL`; // Exclude soft-deleted promotors
  const result = await pool.query(query, [identifier, userId]);

  if (result.rowCount === 0) {
    throw new Error("You do not have permission for this promotor");
  }

  const permissions = result.rows[0].permission;
  if (!permissions.includes(requiredPermission)) {
    throw new Error(`You do not have '${requiredPermission}' permission for this promotor`);
  }
};

/**
 * Helper function to build the update query for promotors.
 * @param {Object} fields - The fields to update.
 * @param {string} identifier - The promotor_code or slug.
 * @returns {Object} An object containing the query and parameters.
 */
const buildUpdateQuery = (fields, identifier) => {
  const updates = [];
  const params = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(fields)) {
    updates.push(`${key} = $${paramIndex}`);
    params.push(value);
    paramIndex++;
  }

  params.push(identifier);

  return {
    query: `UPDATE promotors SET ${updates.join(", ")} WHERE (promotor_code = $${paramIndex} OR slug = $${paramIndex}) AND deleted_at IS NULL RETURNING *`,
    params,
  };
};

/**
 * Helper function to build the select query for promotors with optional filters and pagination.
 * @param {string} baseQuery - The base query string.
 * @param {Object} filters - The filters to apply (e.g., name).
 * @param {Object} pagination - The pagination parameters (e.g., limit, offset).
 * @returns {Object} An object containing the query and parameters.
 */
const buildSelectQuery = (baseQuery, filters = {}, pagination = {}) => {
  const { name } = filters;
  const { limit, offset } = pagination;

  const params = [];
  let query = baseQuery;

  if (name) {
    query += ` AND name ILIKE $${params.length + 1}`;
    params.push(`%${name}%`);
  }

  if (limit && offset !== undefined) {
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
  }

  return { query, params };
};

/**
 * Helper function to validate pagination parameters.
 * @param {number} limit - The limit parameter.
 * @param {number} offset - The offset parameter.
 * @throws {Error} If the pagination parameters are invalid.
 */
const validatePagination = (limit, offset) => {
  if (limit <= 0 || offset < 0) {
    throw new Error("Pagination parameters must be positive integers.", statusCode = STATUS_CODES.BAD_REQUEST);
  }
};

/**
 * Retrieves all promotors with optional pagination and filtering.
 * Query parameters: limit, offset, name (for filtering by promotor name).
 * Excludes soft-deleted promotors (where deleted_at IS NOT NULL).
 */
export const getPromotors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    validatePagination(limit, offset);

    const { name } = req.query;

    const baseQuery = `
      SELECT id, promotor_code, slug, name, description, contact_person
      FROM promotors
      WHERE deleted_at IS NULL`; // Exclude soft-deleted promotors

    const { query, params } = buildSelectQuery(baseQuery, { name }, { limit, offset });

    const result = await pool.query(query, params);

    successResponse(res, {
      promotors: result.rows,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    }, "Promotors retrieved successfully.");
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

/**
 * Retrieves a single promotor by identifier (promotor_code or slug).
 * Excludes soft-deleted promotors (where deleted_at IS NOT NULL).
 */
export const getPromotor = async (req, res) => {
  try {
    const { identifier } = req.params;

    const query = `
      SELECT id, promotor_code, slug, name, description, contact_person
      FROM promotors
      WHERE (promotor_code = $1 OR slug = $1) AND deleted_at IS NULL`; // Exclude soft-deleted promotors
    const result = await pool.query(query, [identifier]);

    if (result.rowCount === 0) {
      return errorResponse(res, `No promotor found with identifier '${identifier}'.`, STATUS_CODES.NOT_FOUND);
    }

    successResponse(res, result.rows[0], `Promotor with identifier '${identifier}' retrieved successfully.`);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

/**
 * Adds a new promotor to the database.
 */
export const addPromotor = async (req, res) => {
  try {
    const {
      name,
      description,
      contact_person,
      contact_person_position,
      contact_person_phone,
      contact_person_email,
      location_id,
      image_url,
      website_url,
    } = req.body;

    // Generate unique promotor_code and slug
    const promotor_code = await generateUniqueValue(
      "promotor_code",
      generateRandomHex
    );
    const slug = await generateUniqueValue("slug", () => generateSlug(name));

    const query = `
      INSERT INTO promotors 
        (promotor_code, slug, name, description, contact_person, contact_person_position, 
        contact_person_phone, contact_person_email, location_id, image_url, website_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`;
    const result = await pool.query(query, [
      promotor_code,
      slug,
      name,
      description,
      contact_person,
      contact_person_position,
      contact_person_phone,
      contact_person_email,
      location_id,
      image_url || null,
      website_url || null,
    ]);

    successResponse(res, result.rows[0], "Promotor added successfully.", STATUS_CODES.CREATED);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

/**
 * Updates an existing promotor by identifier (promotor_code or slug).
 * Only updates the fields provided in the request body.
 * Requires 'write' permission.
 */
export const editPromotor = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { userId } = req.user; // Assuming `req.user` contains the logged-in user's details
    const fields = req.body;

    // Check if the user has 'write' permission
    await checkUserPermission(identifier, userId, "write");

    // Build the update query and parameters
    const { query, params } = buildUpdateQuery(fields, identifier);
    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return errorResponse(res, `No promotor found with identifier '${identifier}' to update.`, STATUS_CODES.NOT_FOUND);
    }

    successResponse(res, result.rows[0], `Promotor with identifier '${identifier}' updated successfully.`);
  } catch (error) {
    if (error.message.includes("permission")) {
      return handleAuthError(res, "You do not have permission to update this promotor.", STATUS_CODES.FORBIDDEN);
    }
    handleDatabaseError(error, res);
  }
};

/**
 * Marks a promotor as deleted by setting the 'deleted_at' timestamp.
 * Requires 'delete' permission.
 */
export const deletePromotor = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { userId } = req.user; // Assuming `req.user` contains the logged-in user's details

    // Check if the user has 'delete' permission
    await checkUserPermission(identifier, userId, "delete");

    const query = `
      UPDATE promotors
      SET deleted_at = NOW()
      WHERE (promotor_code = $1 OR slug = $1) AND deleted_at IS NULL
      RETURNING *`; // Exclude already soft-deleted promotors
    const result = await pool.query(query, [identifier]);

    if (result.rowCount === 0) {
      return errorResponse(res, `No promotor found with identifier '${identifier}' to delete.`, STATUS_CODES.NOT_FOUND);
    }

    successResponse(res, result.rows[0], `Promotor with identifier '${identifier}' marked as deleted successfully.`);
  } catch (error) {
    if (error.message.includes("permission")) {
      return handleAuthError(res, "You do not have permission to delete this promotor.", STATUS_CODES.FORBIDDEN);
    }
    handleDatabaseError(error, res);
  }
};