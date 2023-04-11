/**
 * Credit agent routes
 *
 * This module handles credit agent-related routes, including fetching,
 * creating, deleting, and updating credit agent information.
 *
 * @module routes/creditAgentRouter
 * @requires express
 * @requires controllers/creditAgentCtrl
 */

// Import required modules
const router = require('express').Router();
const creditAgentCtrl = require('../controllers/creditAgentCtrl');

// Register credit agent-related routes
router.route('/credit_agent/:agent_code')
    .get(creditAgentCtrl.getCreditAgent)
    .delete(creditAgentCtrl.deleteCreditAgent)
    .put(creditAgentCtrl.updateCreditAgent)

router.route('/credit_agent')
    .post(creditAgentCtrl.createCreditAgent)

// Export the router
module.exports = router;