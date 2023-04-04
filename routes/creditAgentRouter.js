const router = require('express').Router();
const creditAgentCtrl = require('../controllers/creditAgentCtrl');

router.route('/credit_agent/:agent_code')
    .get(creditAgentCtrl.getCreditAgent)
    .delete(creditAgentCtrl.deleteCreditAgent)
    .put(creditAgentCtrl.updateCreditAgent)

router.route('/credit_agent')
    .post(creditAgentCtrl.createCreditAgent)

module.exports = router;