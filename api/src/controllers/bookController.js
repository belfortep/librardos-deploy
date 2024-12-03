const Book = require('../models/Book');
const User = require('../models/User');

const { HttpCodesEnum } = require('../enum/httpCodes');
const Message = require('../models/Message');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().limit(100);

        return res.status(HttpCodesEnum.OK).json(books);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        return res.status(HttpCodesEnum.OK).json(book);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addBookToFavoriteById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Libro no encontrado"})
        }
        const currentUser = await User.findById(req.body.user_id);
        const { password, ...otherDetails } = currentUser._doc;
        
        if (currentUser.books.includes(req.params.id)) {
            await currentUser.updateOne({$pull: {books: req.params.id}})
            return res.status(HttpCodesEnum.OK).json({details: { ...otherDetails }, isAdmin: currentUser._doc.isAdmin});
        }
        await currentUser.updateOne({$push: {books: req.params.id}})
        return res.status(HttpCodesEnum.OK).json({details: { ...otherDetails }, isAdmin: currentUser._doc.isAdmin});
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addBookToToReadList = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Libro no encontrado"})
        }
        const currentUser = await User.findById(req.body.user_id);
        if (currentUser.toReadBooks.includes(req.params.id)) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "Ya tienes este libro en Por Leer" });
        }
        if (currentUser.readBooks.includes(req.params.id)) {
            console.log("CAMBIANDO, ESTABA EN READ")
            await currentUser.updateOne({$pull: {readBooks: req.params.id}})
        }
        if (currentUser.readingBooks.includes(req.params.id)) {
            console.log("CAMBIANDO, ESTABA EN READING")
            await currentUser.updateOne({$pull: {readingBooks: req.params.id}})
        }

        await currentUser.updateOne({$push: {toReadBooks: req.params.id}})
        console.log(`Book with ID ${req.params.id} added to the to-read list of user ${req.body.user_id}`);
        return res.status(HttpCodesEnum.OK).json("Libro agregado a Por Leer")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addBookToReadList = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Libro no encontrado"})
        }
        const currentUser = await User.findById(req.body.user_id);
        if (currentUser.readBooks.includes(req.params.id)) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "Ya tienes este libro en Leidos" });
        }
        if (currentUser.toReadBooks.includes(req.params.id)) {
            console.log("CAMBIANDO, ESTABA EN TOREADBOOKS")
            await currentUser.updateOne({$pull: {toReadBooks: req.params.id}})
        }
        if (currentUser.readingBooks.includes(req.params.id)) {
            console.log("CAMBIANDO, ESTABA EN READING")
            await currentUser.updateOne({$pull: {readingBooks: req.params.id}})
        }
        await currentUser.updateOne({$push: {readBooks: req.params.id}})
        console.log(`Book with ID ${req.params.id} added to the read list of user ${req.body.user_id}`);
        return res.status(HttpCodesEnum.OK).json("Libro agregado a Leidos")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addBookToReadingList = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Libro no encontrado"})
        }
        const currentUser = await User.findById(req.body.user_id);
        if (currentUser.readingBooks.includes(req.params.id)) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "Ya tienes este libro en leyendo" });
        }
        if (currentUser.readBooks.includes(req.params.id)) {
            await currentUser.updateOne({$pull: {readBooks: req.params.id}})
        }
        if (currentUser.toReadBooks.includes(req.params.id)) {
            await currentUser.updateOne({$pull: {toReadBooks: req.params.id}})
        }

        await currentUser.updateOne({$push: {readingBooks: req.params.id}})
        console.log(`Book with ID ${req.params.id} added to the reading list of user ${req.body.user_id}`);
        return res.status(HttpCodesEnum.OK).json("Libro agregado a Leyendo")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addBookToPersonalList = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Libro no encontrado"})
        }
        const currentUser = await User.findById(req.body.user_id);
        const listIndex = currentUser._doc.myBookArrays.findIndex(list => list[0] === req.body.list_name);
        if (!currentUser._doc.myBookArrays[listIndex]) {
            await currentUser.updateOne({$push: {myBookArrays: [req.body.list_name, [req.params.id]]}})
            console.log(`Book with ID ${req.params.id} added to the reading list ${req.body.list_name} of user ${req.body.user_id}`);
            return res.status(HttpCodesEnum.OK).json({ message: "Lista personal creada y libro añadido" });
        }
        if (currentUser._doc.myBookArrays[listIndex].includes(req.params.id)) {
            return res.status(HttpCodesEnum.FORBIDDEN).json({ message: "Ya tienes este libro en la lista personal" });
        }
        await currentUser.updateOne({$push: {["myBookArrays." + listIndex]: req.params.id}})
        console.log(`Book with ID ${req.params.id} added to the reading list ${req.body.list_name} of user ${req.body.user_id}`);
        return res.status(HttpCodesEnum.OK).json({ message: "Libro añadido a la lista personal" });
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const scoreBook = async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id, "scores.user": req.body.user_id})
        if (book) {
            await Book.updateOne(
                {_id: req.params.id, "scores.user": req.body.user_id},
                {$set: {"scores.$.score": req.body.score}}
            );
            return res.status(HttpCodesEnum.OK).json("Libro actualizado") 
        }
        await Book.updateOne(
            {_id: req.params.id},
            {$push: {scores: {score: req.body.score, user: req.body.user_id}}}
        )

        return res.status(HttpCodesEnum.OK).json("Libro actualizado")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addCommentToBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Libro no encontrado"})
        }

        const new_message = new Message({
            username: req.body.username,
            message: req.body.message,
            father_id: req.body.father_id
        })
        await new_message.save()
        
        await book.updateOne({$push: {comments: new_message._id}})
        return res.status(HttpCodesEnum.OK).json("Comentario añadido")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const deleteCommentFromBook = async (req, res) => {
    console.log("Intentando eliminar un mensaje...");
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Libro no encontrado"})
        }
        console.log("Book encontrado, voy a buscar mensajito");
        console.log(book.comments)
        
        if (!book.comments.includes(req.body.message_id)) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Mensaje no encontrado"})
        }
        const msj = await Message.findById(req.body.message_id)
        await book.updateOne({$pull: {comments: msj._id}})
        return res.status(HttpCodesEnum.OK).json("Mensaje eliminado")
    } catch (err) {
        console.error("Error al eliminar el mensaje:", err.message);
        return res
            .status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}


module.exports = {
    getBookById,
    getAllBooks,
    addBookToFavoriteById,
    addBookToReadList,
    addBookToReadingList,
    addBookToToReadList,
    scoreBook,
    addCommentToBook,
    addBookToPersonalList,
    deleteCommentFromBook
}