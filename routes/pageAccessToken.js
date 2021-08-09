const express = require('express');
const router = express.Router();

// Controller
const PageAccessTokenController = require('../controllers/PageAccessTokenController');

// set PageAccessToken in client cookie
router.get('/', PageAccessTokenController.PostPageAccessTokenByParam);

// set PageAccessToken in client cookie by request body
router.post('/', PageAccessTokenController.PostPageAccessTokenByBody);

module.exports = router;
