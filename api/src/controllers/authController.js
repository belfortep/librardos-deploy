const User = require('../models/User');
const Community = require('../models/Community');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HttpCodesEnum } = require('../enum/httpCodes');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user_exists = await User.findOne({ username: req.body.username });
        if (user_exists) return res.status(HttpCodesEnum.BAD_REQUEST).json({ message: "User already exists"})
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        let isAdmin = false
        if (req.body.isAdmin) {
            isAdmin = true
        }
        const user = new User({
            username,
            email,
            password: hash,
            isAdmin
        })
        await user.save();
        return res.status(HttpCodesEnum.CREATED).send('User created');
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(HttpCodesEnum.NOT_FOUND).send('User not found');

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return res.status(HttpCodesEnum.NOT_FOUND).send('Incorrect password or user');

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT)
        const { password, ...otherDetails } = user._doc;
        return res.cookie("access_token", token, { httpOnly: true }).status(HttpCodesEnum.OK).json({ details: { ...otherDetails }, isAdmin: user._doc.isAdmin });

    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const updateAuthInformation = async (req, res) => {
    try {

        const { email, user_password } = req.body
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user_password, salt);
        const new_data = {
            email,
            password: hash
        }
        const user = await User.findByIdAndUpdate(req.params.id, {$set: new_data}, {new:true})
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        const {password, ...otherDetails} = user._doc
        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}


const updateUserInformation = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true})
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        const {password, ...otherDetails} = user._doc
        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addFavoriteGenres = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        
        await user.updateOne({$push: {genres: req.body.genre}})
        const new_user = await User.findById(req.params.id);
        const {password, ...otherDetails} = new_user._doc
        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addFavoriteWriters = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        
        await user.updateOne({$push: {writers: req.body.writer}})
        const new_user = await User.findById(req.params.id);
        const {password, ...otherDetails} = new_user._doc
        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}



const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        return res.status(HttpCodesEnum.OK).json(user._doc.books);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        return res.status(HttpCodesEnum.OK).json(user);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(HttpCodesEnum.OK).json(users);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getToReadBooks = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        return res.status(HttpCodesEnum.OK).json(user._doc.toReadBooks);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getUserByName = async (req, res) => {
    console.log(req.body.name)
    try {
        const user = await User.find({ username: {$regex: req.body.username, $options: "i"}});
        return res.status(HttpCodesEnum.OK).json(user);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}
  
const getRead = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        return res.status(HttpCodesEnum.OK).json(user._doc.readBooks);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getListBooks = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user._doc.myBookArrays);
        return res.status(HttpCodesEnum.OK).json(user._doc.myBookArrays);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getReadingBooks = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        return res.status(HttpCodesEnum.OK).json(user._doc.readingBooks);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const sendFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);    // id de quien quiero ser pana
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        
        await user.updateOne({$push: {pending_friend_request: req.body.my_name}})   // mi propio nombre

        return res.status(HttpCodesEnum.OK).json({ message: "Solicitud enviada"})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const accepFriendRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);    // mi propio id
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }

        const my_friend = await User.findOne({ username: req.body.friend_name });
        await my_friend.updateOne({$push: {friends: user._doc.username}})
        await user.updateOne({$push: {friends: req.body.friend_name}})   // nombre de mi pana
        await user.updateOne({$pull: {pending_friend_request: req.body.friend_name}})   // lo quito de pending
        const new_user = await User.findById(req.params.id);
        const {password, ...otherDetails} = new_user._doc
        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const accepModeratorRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);    // mi propio id
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        const community_name = req.body.community_name;
        const community = await Community.findOne({ name: community_name });
        // const res = await axios.put("/addModerator/" + community._id, { user_id: user._id });

        await community.updateOne({$push: {moderators: req.params.id}})

        await user.updateOne({$pull: {pending_moderator_request: community_name}})

        const new_user = await User.findById(req.params.id);
        const {password, ...otherDetails} = new_user._doc

        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const refuseModRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);    // mi propio id
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }

        const community_name = req.body.community_name;
        await user.updateOne({$pull: {pending_moderator_request: community_name}})

        const new_user = await User.findById(req.params.id);
        const {password, ...otherDetails} = new_user._doc

        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}


const deleteFriend = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);    // mi propio id
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }

        const my_friend = await User.findOne({ username: req.body.friend_name });
        await my_friend.updateOne({$pull: {friends: user._doc.username}})
        await user.updateOne({$pull: {friends: req.body.friend_name}})   // nombre de mi pana
        const new_user = await User.findById(req.params.id);
        const {password, ...otherDetails} = new_user._doc
        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const updateUserSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);    // mi propio id
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        await user.updateOne({$set: {isPremium: true}})   // nombre de mi pana
        const new_user = await User.findById(req.body.userId);
        const {password, ...otherDetails} = new_user._doc
        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const removeUserSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);    // mi propio id
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        await user.updateOne({$set: {isPremium: false}})   // nombre de mi pana
        const new_user = await User.findById(req.body.userId);
        const {password, ...otherDetails} = new_user._doc
        return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}


const blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);    // este soy yo
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        var { password, ...otherDetails } = user._doc;
        
        if (user.blocked_users.includes(req.body.user_id)) {
            await user.updateOne({$pull: {blocked_users: req.body.user_id}})
            return res.status(HttpCodesEnum.OK).json({details: { ...otherDetails }, isAdmin: user._doc.isAdmin});
        }
        await user.updateOne({$push: {blocked_users: req.body.user_id}})
        const updatedUser = await User.findById(req.params.id)
        var { password, ...otherDetails} = updatedUser._doc
        return res.status(HttpCodesEnum.OK).json({details: { ...otherDetails }, isAdmin: user._doc.isAdmin});
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        await user.deleteOne(); // deleteOne() es un método de mongoose
        return res.status(HttpCodesEnum.OK).json("Usuario eliminado")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

module.exports = {
    register,
    login,
    getFavorites,
    getUserById,
    getAllUsers,
    getUserByName,
    getToReadBooks,
    getRead,
    getReadingBooks,
    updateAuthInformation,
    updateUserInformation,
    addFavoriteGenres,
    addFavoriteWriters,
    sendFriendRequest,
    accepFriendRequest,
    deleteFriend,
    getListBooks,
    updateUserSubscription,
    blockUser,
    accepModeratorRequest,
    removeUserSubscription,
    deleteUser,
    refuseModRequest
}
