import pool from "../../../db.js";
import { handleDatabaseError } from "../../../utils/errorHandler.js";

/**
 * Retrieves a list of promotor managers grouped by promotor (by code or slug).
 * Includes manager details from the users table using manager_id.
 */
export const getPromotorManagers = async (req, res) => {
  try {
    const { identifier } = req.params; // Get promotor_code or slug from params
    const { name } = req.query;

    const params = [];
    let query = `
      SELECT 
        p.id AS promotor_id,
        p.name AS promotor_name,
        p.promotor_code,
        p.slug AS promotor_slug,
        json_agg(
          json_build_object(
            'manager_id', u.id,
            'manager_name', u.name,
            'manager_email', u.email,
          )
        ) AS managers
      FROM promotors p
      INNER JOIN promotor_managers pm ON pm.promotor_id = p.id
      INNER JOIN users u ON pm.manager_id = u.id
      WHERE (p.promotor_code = $1 OR p.slug = $1)`;

    params.push(identifier);

    // Add optional filtering by manager name
    if (name) {
      query += ` AND u.name ILIKE $${params.length + 1}`;
      params.push(`%${name}%`);
    }

    // Group by promotor details
    query += ` GROUP BY p.id, p.name, p.promotor_code, p.slug`;

    const result = await pool.query(query, params);

    // If no promotors are found, return an empty array
    if (result.rows.length === 0) {
      return res.json([]);
    }

    // Return the grouped list of promotors with their managers
    res.json(result.rows);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

/**
 * Retrieves a single promotor manager by promotor identifier and manager ID.
 * Includes related user and promotor details.
 */
export const getPromotorManager = async (req, res) => {
  try {
    const { identifier, manager_id } = req.params; // Get promotor and manager from params

    const query = `
      SELECT 
        pm.id AS promotor_manager_id,
        u.id AS user_id,
        u.name AS manager_name,
        u.email AS manager_email,
        p.id AS promotor_id,
        p.name AS promotor_name,
        p.promotor_code,
        p.slug AS promotor_slug,
        pm.permission,
        pm.status
      FROM promotor_managers pm
      INNER JOIN promotors p ON pm.promotor_id = p.id
      INNER JOIN users u ON pm.manager_id = u.id
      WHERE (p.promotor_code = $1 OR p.slug = $1)
        AND pm.manager_id = $2`;

    const result = await pool.query(query, [identifier, manager_id]);

    // If no promotor manager is found, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Promotor Manager not found" });
    }

    // Return the detailed promotor manager information
    res.json(result.rows[0]);
  } catch (error) {
    handleDatabaseError(error, res);
  }
};

/**
 * Adds a new promotor manager by associating an existing user from the users table.
 * Promotor is identified via promotor_code or slug in params.
 * Manager and permission details are provided in the body.
 * If permission is not provided or empty, it defaults to ["read"].
 * Permission must always include "read".
 */
export const addPromotorManager = async (req, res) => {
  try {
    const { identifier } = req.params; // Get promotor_code or slug from params
    const { manager_id, permission } = req.body; // Get manager and permission details from body

    // Validate required fields
    if (!identifier || !manager_id) {
      return res.status(400).json({ error: "Promotor identifier and manager_id are required" });
    }

    // Default permission to ["read"] if not provided or empty
    const validPermissions = ["read", "write", "delete"];
    let finalPermission = Array.isArray(permission) && permission.length > 0
      ? [...new Set(["read", ...permission])] // Ensure "read" is always included
      : ["read"];

    // Validate permission
    if (!finalPermission.every((perm) => validPermissions.includes(perm))) {
      return res.status(400).json({
        error: `Invalid permission value. Allowed values are some or all of ${JSON.stringify(validPermissions)}`,
      });
    }

    // Get the promotor ID using the identifier
    const promotorQuery = `
      SELECT id
      FROM promotors
      WHERE promotor_code = $1 OR slug = $1`;
    const promotorResult = await pool.query(promotorQuery, [identifier]);

    if (promotorResult.rowCount === 0) {
      return res.status(404).json({ error: "Promotor not found" });
    }

    const promotor_id = promotorResult.rows[0].id;

    // Insert the new promotor manager
    const query = `
      INSERT INTO promotor_managers (manager_id, promotor_id, permission)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const params = [manager_id, promotor_id, JSON.stringify(finalPermission)]; // Save permission as JSON

    const result = await pool.query(query, params);

    // Return the newly created promotor manager association
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // Handle unique constraint violation (e.g., duplicate manager-promotor association)
      return res.status(400).json({ error: "This manager is already associated with the specified promotor" });
    } else if (error.code === "23503") {
      // Handle foreign key violation (e.g., invalid manager_id or promotor_id)
      return res.status(400).json({ error: "Invalid manager_id or promotor_id" });
    }

    // Use centralized error handling for unexpected errors
    handleDatabaseError(error, res);
  }
};

/**
 * Updates the permission and status of a promotor manager.
 * Promotor is identified via promotor_code or slug, and manager via manager_id in params.
 * Permission and status are provided in the body.
 * If permission is not provided or empty, it defaults to ["read"].
 * Permission must always include "read".
 */
export const editPromotorManager = async (req, res) => {
  try {
    const { identifier, manager_id } = req.params; // Get promotor and manager from params
    const { permission, status } = req.body; // Get permission and status from body

    // Validate required fields
    if (!identifier || !manager_id) {
      return res.status(400).json({ error: "Promotor identifier and manager_id are required" });
    }

    if (!permission && !status) {
      return res.status(400).json({ error: "At least one of 'permission' or 'status' must be provided" });
    }

    // Validate and process permission if provided
    const validPermissions = ["read", "write", "delete"];
    let finalPermission = null;

    if (permission) {
      finalPermission = Array.isArray(permission) && permission.length > 0
        ? [...new Set(["read", ...permission])] // Ensure "read" is always included
        : ["read"];

      if (!finalPermission.every((perm) => validPermissions.includes(perm))) {
        return res.status(400).json({
          error: `Invalid permission value. Allowed values are some or all of ${JSON.stringify(validPermissions)}`,
        });
      }
    }

    // Dynamically build the query and parameters
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (finalPermission) {
      updates.push(`permission = $${paramIndex}`);
      params.push(JSON.stringify(finalPermission)); // Save permission as JSON
      paramIndex++;
    }

    if (status) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    // Add promotor identifier and manager_id to the parameters
    params.push(identifier, manager_id);

    const query = `
      UPDATE promotor_managers pm
      SET ${updates.join(", ")}
      FROM promotors p
      WHERE pm.promotor_id = p.id
        AND (p.promotor_code = $${paramIndex} OR p.slug = $${paramIndex})
        AND pm.manager_id = $${paramIndex + 1}
      RETURNING pm.*`;

    const result = await pool.query(query, params);

    // If no promotor manager is found, return a 404 error
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Promotor Manager not found" });
    }

    // Return the updated promotor manager
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23503") {
      // Handle foreign key violation (e.g., invalid promotor or manager references)
      return res.status(400).json({ error: "Invalid promotor identifier or manager_id" });
    }

    // Use centralized error handling for unexpected errors
    handleDatabaseError(error, res);
  }
};

/**
 * Sets the status of a promotor manager to 'inactive' instead of deleting the record.
 * Promotor is identified via promotor_code or slug, and manager via manager_id in params.
 */
export const deletePromotorManager = async (req, res) => {
  try {
    const { identifier, manager_id } = req.params; // Get promotor and manager from params

    // Update the status of the promotor manager to 'inactive'
    const query = `
      UPDATE promotor_managers pm
      SET status = 'inactive'
      FROM promotors p
      WHERE pm.promotor_id = p.id
        AND (p.promotor_code = $1 OR p.slug = $1)
        AND pm.manager_id = $2
      RETURNING pm.*`;
    const result = await pool.query(query, [identifier, manager_id]);

    // If no promotor manager is found, return a 404 error
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Promotor Manager not found" });
    }

    // Return the updated promotor manager
    res.json({ message: "Promotor Manager status set to inactive", manager: result.rows[0] });
  } catch (error) {
    handleDatabaseError(error, res);
  }
};