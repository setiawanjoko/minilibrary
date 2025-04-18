/**
 * Seed file for populating the `promotor_managers` table in the database.
 *
 * This file defines a list of promotor-manager relationships, including their
 * permissions, status, and timestamps. It deletes all existing entries in the
 * `promotor_managers` table before inserting the new seed data.
 *
 * @file /d:/javascript-projects/ukt_minilibrary/database/seeds/06_seed_promotor_managers.cjs
 *
 * @constant {Array<Object>} promotorManagers - Array of promotor-manager objects.
 * @property {number} promotorManagers[].id - Unique identifier for the promotor-manager relationship.
 * @property {number} promotorManagers[].promotor_id - ID of the associated promotor.
 * @property {number} promotorManagers[].manager_id - ID of the associated manager.
 * @property {string} promotorManagers[].permissions - JSON string representing the permissions granted to the manager.
 * @property {string} promotorManagers[].status - Status of the relationship (e.g., "active", "inactive").
 * @property {Date} promotorManagers[].created_at - Timestamp of when the record was created.
 * @property {Date} promotorManagers[].updated_at - Timestamp of when the record was last updated.
 *
 * @function seed
 * @async
 * @param {Object} knex - Knex.js database instance.
 * @returns {Promise<void>} Resolves when the seed operation is complete.
 *
 * @description
 * The `seed` function performs the following operations:
 * 1. Deletes all existing entries in the `promotor_managers` table.
 * 2. Inserts the predefined `promotorManagers` data into the table.
 */

const promotorManagers = [
    {
        id: 1,
        promotor_id: 1,
        manager_id: 1,
        permissions: JSON.stringify(["read", "write", "delete"]),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 2,
        promotor_id: 2,
        manager_id: 2,
        permissions: JSON.stringify(["read", "write", "delete"]),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 3,
        promotor_id: 3,
        manager_id: 3,
        permissions: JSON.stringify(["read", "write", "delete"]),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 4,
        promotor_id: 4,
        manager_id: 4,
        permissions: JSON.stringify(["read", "write", "delete"]),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 5,
        promotor_id: 5,
        manager_id: 5,
        permissions: JSON.stringify(["read", "write", "delete"]),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
    },
    // New random managers with random permissions
    {
        id: 6,
        promotor_id: 2,
        manager_id: 6,
        permissions: JSON.stringify(["read"]),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 7,
        promotor_id: 4,
        manager_id: 7,
        permissions: JSON.stringify(["read", "write"]),
        status: "inactive",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: 8,
        promotor_id: 1,
        manager_id: 8,
        permissions: JSON.stringify(["read", "delete"]),
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
    },
];

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('promotor_managers').del();
    // Inserts seed entries
    await knex('promotor_managers').insert(promotorManagers);
};