/**
 * Database connection module
 *
 * This module exports an object that allows querying the database using the Pool
 * method from the 'pg' library.
 *
 * @module database/db
 * @requires pg
 */

const { Pool } = require('pg');

// Initialize the PostgreSQL pool with environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

module.exports = {
    query: (text, params) => pool.query (text, params),
};