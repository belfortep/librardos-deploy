const express = require('express');
const { login, register, getFavorites, getUserById, getToReadBooks, getReadingBooks, getRead, getAllUsers, getUserByName, updateAuthInformation, updateUserInformation, updateUserSubscription, addFavoriteGenres, addFavoriteWriters, sendFriendRequest, accepFriendRequest, deleteFriend ,blockUser, getListBooks, accepModeratorRequest, removeUserSubscription, deleteUser, refuseModRequest } = require('../controllers/authController');
const { verifyUser } = require('../util/verifyToken');
const router = express();

router.post('/register', register);
router.post('/login', login);
router.get("/fav/:id", verifyUser, getFavorites)
router.get("/reading/:id", verifyUser, getReadingBooks)
router.get("/toRead/:id", verifyUser, getToReadBooks)
router.get("/read/:id", verifyUser, getRead)
router.get("/status/:id", verifyUser, getToReadBooks)
router.get("/list/:id", verifyUser, getListBooks)
router.get("/:id", verifyUser, getUserById)

router.get('/', verifyUser,getAllUsers);
router.post("/name", verifyUser,getUserByName);

router.put("/auth/:id", verifyUser, updateAuthInformation)
router.put("/user/:id", verifyUser, updateUserInformation)
router.put("/genre/:id", verifyUser, addFavoriteGenres)
router.put("/writer/:id", verifyUser, addFavoriteWriters)
router.put("/sendFriend/:id", verifyUser, sendFriendRequest)
router.put("/acceptFriend/:id", verifyUser, accepFriendRequest)
router.put("/block/:id", verifyUser, blockUser)
router.put("/premium/:id", verifyUser, updateUserSubscription)
router.delete("/premium/:id", verifyUser, removeUserSubscription)
router.delete("/delete/:id", verifyUser, deleteUser)


router.delete("/deleteFriend/:id", verifyUser, deleteFriend)

router.put("/refuseModReq/:id", verifyUser, refuseModRequest)
router.put("/acceptModeratorRequest/:id", verifyUser, accepModeratorRequest)

module.exports = router;