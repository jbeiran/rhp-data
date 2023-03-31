const router = require('express').Router();
const creditClientCtrl = require('../controllers/creditClientCtrl');

router.route('/credit_client/:client_code')
    .get(creditClientCtrl.getCreditClient)
    .delete(creditClientCtrl.deleteCreditClient)
    .put(creditClientCtrl.updateCreditClient)

router.route('/credit_client/create')
    .post(creditClientCtrl.createCreditClient)

module.exports = router;