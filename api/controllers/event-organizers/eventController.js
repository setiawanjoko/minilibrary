import pool from "../../../db.js";
import { handleDatabaseError } from "../../utils/errorHandler.js";
import { generateUniqueValue, generateRandomHex, generateSlug } from "../../../utils/helpers.js";

/**
 * Get all events
 */
export const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events");
    res.status(200).json(result.rows);
  } catch (err) {
    handleDatabaseError(err, res, "Failed to fetch events");
  }
};

/**
 * Get event by event_code or slug
 */
export const getEventById = async (req, res) => {
  const { identifier } = req.params;

  try {
    let result = await pool.query("SELECT * FROM events WHERE event_code = $1 OR slug = $1", [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    handleDatabaseError(err, res, "Failed to fetch event");
  }
};

/**
 * Create a new event
 */
export const createEvent = async (req, res) => {
  const {
    name,
    description,
    location_id,
    start_time,
    end_time,
    visibility,
    tags,
    image_url,
    timezone,
    currency,
    ticket_details,
  } = req.body;

  try {
    // Generate unique promotor_code and slug
    const event_code = await generateUniqueValue(
      "event_code",
      generateRandomHex
    );
    const slug = await generateUniqueValue("slug", () => generateSlug(name));

    // Get promotor_id from logged-in user's promotor manager details
    const promotor_id = req.user.promotor_id;

    const result = await pool.query(
      `INSERT INTO events (
        event_code, slug, name, description, location_id, start_time, end_time,
        promotor_id, visibility, tags, image_url, timezone, currency, ticket_details
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        event_code,
        slug,
        name,
        description,
        location_id,
        start_time,
        end_time,
        promotor_id,
        visibility,
        tags,
        image_url,
        timezone,
        currency,
        JSON.stringify(ticket_details),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleDatabaseError(err, res, "Failed to create event");
  }
};

/**
 * Update an event by event_code or slug
 */
export const updateEvent = async (req, res) => {
  const { event_code, slug } = req.query;
  const {
    name,
    description,
    location_id,
    start_time,
    end_time,
    visibility,
    tags,
    image_url,
    timezone,
    currency,
    ticket_details,
  } = req.body;

  try {
    let result;

    if (event_code) {
      result = await pool.query(
        `UPDATE events SET
          name = $1, description = $2, location_id = $3, start_time = $4, end_time = $5,
          visibility = $6, tags = $7, image_url = $8, timezone = $9, currency = $10,
          ticket_details = $11, updated_at = NOW()
        WHERE event_code = $12
        RETURNING *`,
        [
          name,
          description,
          location_id,
          start_time,
          end_time,
          visibility,
          tags,
          image_url,
          timezone,
          currency,
          JSON.stringify(ticket_details),
          event_code,
        ]
      );
    } else if (slug) {
      result = await pool.query(
        `UPDATE events SET
          name = $1, description = $2, location_id = $3, start_time = $4, end_time = $5,
          visibility = $6, tags = $7, image_url = $8, timezone = $9, currency = $10,
          ticket_details = $11, updated_at = NOW()
        WHERE slug = $12
        RETURNING *`,
        [
          name,
          description,
          location_id,
          start_time,
          end_time,
          visibility,
          tags,
          image_url,
          timezone,
          currency,
          JSON.stringify(ticket_details),
          slug,
        ]
      );
    } else {
      return res.status(400).json({ error: "Either event_code or slug must be provided" });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    handleDatabaseError(err, res, "Failed to update event");
  }
};

/**
 * Mark an event as inactive
 */
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE events SET status = 'inactive', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event marked as inactive", event: result.rows[0] });
  } catch (err) {
    handleDatabaseError(err, res, "Failed to mark event as inactive");
  }
};