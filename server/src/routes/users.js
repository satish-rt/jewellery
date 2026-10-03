const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { registerUser, loginUser, getUsers, getMe, logoutUser, exportUsersCSV } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.post('/logout', logoutUser);
router.get('/export/csv', auth, exportUsersCSV);
router.get('/', auth, getUsers);

module.exports = router;