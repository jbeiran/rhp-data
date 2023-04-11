/**
 * Express server configuration
 *
 * This script configures and starts the Express server, handling requests
 * for the user, receipts, credit clients, and credit agents routes.
 *
 * @module server
 * @requires dotenv
 * @requires express
 * @requires cookie-parser
 * @requires cors
 * @requires helmet
 * @requires body-parser
 * @requires database/db
 * @requires routes/userRouter
 * @requires routes/receiptsRouter
 * @requires routes/creditClientRouter
 * @requires routes/creditAgentRouter
*/

// Import required modules
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet');
const bodyParser = require('body-parser');
const pool = require('./database/db')

// Create the Express application
const app = express();

// Apply middlewares
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || `http://${process.env.HOST}:3000`,
    credentials: true,
}));

// Register routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/receiptsRouter'))
app.use('/api', require('./routes/creditClientRouter'))
app.use('/api', require('./routes/creditAgentRouter'))

/**
 * Test database connection
 *
 * Log an error if the connection fails, otherwise log a successful connection
 * message with the current date and time.
 */

pool.query('SELECT NOW()', (err, res) => {
    if (err) console.error('Error al conectarse a la base de datos:', err);
    else console.log('Conexión a la base de datos exitosa:', res.rows[0])
})

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://${process.env.HOST}:${PORT}`);
});
