/**
 * Credit client routes
 *
 * This module handles credit client-related routes, including fetching,
 * creating, deleting, and updating credit client information.
 *
 * @module routes/creditClientRouter
 * @requires express
 * @requires controllers/creditClientCtrl
 */

// Import required modules
const router = require('express').Router();
const creditClientCtrl = require('../controllers/creditClientCtrl');

// Register credit client-related routes
router.route('/credit_client/:client_code')
    .get(creditClientCtrl.getCreditClient)
    .delete(creditClientCtrl.deleteCreditClient)
    .put(creditClientCtrl.updateCreditClient)

router.route('/credit_client')
    .post(creditClientCtrl.createCreditClient)

// Export the router
module.exports = router;