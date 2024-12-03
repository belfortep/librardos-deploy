const Router = require('express')
const router = Router();
const { verifyUser } = require('../util/verifyToken');
const { getAllCommunities, joinCommunity, createCommunity, joinCommunityAsMod, renameCommunity, getCommunity, getCommunityByName, getCommunityByBook, exitCommunity, addMessageToCommunity, getCommunityByGender, deleteCommunity, deleteMessageToCommunity, sendModeratorRequest } = require('../controllers/communityController');

router.get('/', verifyUser, getAllCommunities);
router.post("/name", verifyUser, getCommunityByName)
router.post("/book", verifyUser, getCommunityByBook)
router.post("/gender", verifyUser, getCommunityByGender)
router.get('/:id', verifyUser, getCommunity);
router.post("/", verifyUser, createCommunity);
router.post("/message/:id", verifyUser, addMessageToCommunity)
router.delete("/message/:id", verifyUser, deleteMessageToCommunity)
router.post("/exit/:id", verifyUser, exitCommunity)
router.post("/mod/:id", verifyUser, joinCommunityAsMod);
router.post('/:id', verifyUser, joinCommunity);
router.patch('/:id', verifyUser, renameCommunity);
router.delete('/:id', verifyUser, deleteCommunity);
router.put("/sendModeratorRequest/:id", verifyUser, sendModeratorRequest);
// router.put("/addModerator/:id", verifyUser, addModerator);

module.exports = router