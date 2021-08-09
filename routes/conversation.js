const express = require('express');
const router = express.Router();

const ConversationController = require('../controllers/ConversationController');

/* Save all conversations to database. */
router.post('/', ConversationController.PostConversation);

router.get('/', ConversationController.GetAllConversation);

router.get('/:id', ConversationController.DeleteConversationById);

router.delete('/:id', ConversationController.DeleteConversationById);

module.exports = router;
