const router = require('express').Router();
const receiptsCtrl = require('../controllers/receiptsCtrl');

router.route('/receipts')
    .get(receiptsCtrl.getReceipts)
    .post(receiptsCtrl.createReceipt)

router.route('/receipts/:id')
    .delete(receiptsCtrl.deleteReceipt)
    .put(receiptsCtrl.updateReceipt)

module.exports = router;