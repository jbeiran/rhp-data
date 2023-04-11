/**
 * Receipts routes
 *
 * This module handles receipt-related routes, including fetching receipts,
 * creating new receipts, deleting receipts, and updating receipts.
 *
 * @module routes/receiptsRouter
 * @requires express
 * @requires controllers/receiptsCtrl
 */

// Import required modules
const router = require('express').Router();
const receiptsCtrl = require('../controllers/receiptsCtrl');

// Register receipts-related routes
router.route('/receipts')
    .get(receiptsCtrl.getReceipts)
    .post(receiptsCtrl.createReceipt)

router.route('/receipts/:id')
    .delete(receiptsCtrl.deleteReceipt)
    .put(receiptsCtrl.updateReceipt)

// Export the router
module.exports = router;