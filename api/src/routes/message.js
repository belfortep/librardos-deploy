const Router = require('express')
const router = Router();
const { verifyUser } = require('../util/verifyToken');
const { getMessageById, updateMessageById } = require('../controllers/messageController');


router.get('/:id', verifyUser, getMessageById);
router.put("/:id", verifyUser, updateMessageById)

module.exports = router