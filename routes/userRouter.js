/** 
* User routes
*
* This module handles user-related routes, including registration,
* login, logout, refreshing tokens, and retrieving user information.
*
* @module routes/userRouter
* @requires express
* @requires controllers/userCtrl
* @requires middlewares/auth
*/

// Import required modules
const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middlewares/auth');

// Register user-related routes
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);
router.get('/refresh_token', userCtrl.refreshToken);
router.get('/infor', auth, userCtrl.getUser);

// Export the router
module.exports = router;
