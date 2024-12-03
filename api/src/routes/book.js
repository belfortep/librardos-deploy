const Router = require('express')
const router = Router();
const { getAllBooks, getBookById, addBookToFavoriteById, addBookToReadList, addBookToToReadList, addBookToReadingList, scoreBook, addCommentToBook, addBookToPersonalList, deleteCommentFromBook } = require('../controllers/bookController');
const { verifyUser } = require('../util/verifyToken');



router.get('/', verifyUser, getAllBooks);
router.post('/fav/:id', verifyUser, addBookToFavoriteById);
router.post('/toReadBooks/:id', verifyUser,addBookToToReadList);
router.post('/readBooks/:id', verifyUser,addBookToReadList);
router.post('/readingBooks/:id', verifyUser,addBookToReadingList);
router.post('/myBookLists/:id', verifyUser, addBookToPersonalList);
router.post("/message/:id", verifyUser, addCommentToBook);
router.post("/scoreBooks/:id", verifyUser, scoreBook);

router.put("/message/:id", verifyUser, deleteCommentFromBook)
router.get('/:id', verifyUser, getBookById);

module.exports = router