const Community = require('../models/Community');
const Book = require('../models/Book')
const User = require('../models/User');

const { HttpCodesEnum } = require('../enum/httpCodes');
const Message = require('../models/Message');

const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find();

        return res.status(HttpCodesEnum.OK).json(communities);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const createCommunity = async (req, res) => {
    try {
        const { name, bookId, user_id, type } = req.body

        const user = await User.findById(user_id)
        if (!user.isPremium && user.communities.length >= 3) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({message : "Solo los premium pueden crear o unirse a mas de 3 comunidades"})
        }

        const community_exists = await Community.findOne({ name: name });
        const bookObj = await Book.findById(bookId)
        if (community_exists) return res.status(HttpCodesEnum.BAD_REQUEST).JSON({ message: "Community already exists"})
        const community = new Community({
            name: name,
            bookId: bookId,
            bookName: bookObj._doc.title,
            bookGender: bookObj._doc.gender,
            bookAuthor: bookObj._doc.writer,
            type: type
        })
        await community.save();
        return res.status(HttpCodesEnum.CREATED).send(community._id);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const deleteCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        if (!community) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
        }
        for (let user_id of community.users) {
            const myuser = await User.findById(user_id)
            await myuser.updateOne({$pull: {communities: req.params.id}})
        }

        await community.deleteOne();
        return res.status(HttpCodesEnum.OK).json("Comunidad eliminada")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const renameCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        if (!community) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
        }
        community.name = req.body.name;
        await community.save();
        return res.status(HttpCodesEnum.OK).json("Comunidad eliminada")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const joinCommunityAsMod = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        const user = await User.findById(req.body.id)

        if (!community) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
        }

        if (!community.users.includes(req.body.id)) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "No podes moderar a una comunidad en la que no estas" });
        }
       
        if (community.moderators.includes(req.body.id)) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "No podes moderar a una comunidad en la que ya sos" });
        }
        
        await community.updateOne({$push: {moderators: req.body.id}})
        return res.status(HttpCodesEnum.OK).json("Unido a la policia de la comunidad")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const joinCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        const user = await User.findById(req.body.id)

        if (!community) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
        }
       
        if (community.users.includes(req.body.id)) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "No podes unirte a una comunidad en la que ya estas" });
        }

        if (!user.isPremium && user.communities.length >= 3) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({message : "Solo los premium pueden unirse a mas de 3 comunidades"})
        }
        
        await community.updateOne({$push: {users: req.body.id}})
        await user.updateOne({$push: {communities: req.params.id}})
        return res.status(HttpCodesEnum.OK).json("Unido a comunidad")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const exitCommunity = async (req, res) => {
    try {
        console.log("ME VOY DE COMUNIDAD")
        const community = await Community.findById(req.params.id);
        const user = await User.findById(req.body.id)
        if (!community) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
        }
       
        if (!community.users.includes(req.body.id)) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "No podes salir de una comunidad que no pertenecias" });
        }
        await community.updateOne({$pull: {users: req.body.id}})
        await user.updateOne({$pull: {communities: req.params.id}})
        
        if (community.moderators.includes(req.body.id)) {
            
            await community.updateOne({$pull: {moderators: req.body.id}})
        }
        

        return res.status(HttpCodesEnum.OK).json("Eliminado de comunidad")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        return res.status(HttpCodesEnum.OK).json(community);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getCommunityByName = async (req, res) => {
    try {
        const community = await Community.find({ name: {$regex: req.body.name, $options: "i"}});
        return res.status(HttpCodesEnum.OK).json(community);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getCommunityByBook = async (req, res) => {
    try {
        const community = await Community.find({ bookName: {$regex: req.body.bookName, $options: "i"}});
        return res.status(HttpCodesEnum.OK).json(community);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const getCommunityByGender = async (req, res) => {
    try {
        const community = await Community.find({ bookGender: {$regex: req.body.bookGender, $options: "i"}});
        return res.status(HttpCodesEnum.OK).json(community);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const addMessageToCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        if (!community) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
        }
        
        const new_message = new Message({
            username: req.body.username,
            message: req.body.message,
            father_id: req.body.father_id
        })
        await new_message.save()
        
        await community.updateOne({$push: {messages: new_message._id}})
        return res.status(HttpCodesEnum.OK).json("Mensaje añadido")
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const deleteMessageToCommunity = async(req, res) => {
    console.log("Intentando eliminar un mensaje...");
    try {
        const community = await Community.findById(req.params.id);
        if (!community) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
        }
        console.log("Comunidad encontrada, voy a buscar mensajito");
        if (!community.messages.includes(req.body.message_id)) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Mensaje no encontrado"})
        }
        const msj = await Message.findById(req.body.message_id)
        console.log(`${msj.message}`)
        console.log("Mensaje encontrado, voy a eliminarlo");
        await community.updateOne({$pull: {messages: msj._id}})
        console.log("Mensaje eliminado correctamente");
        await community.save()
        return res.status(HttpCodesEnum.OK).json("Mensaje eliminado")

    } catch (err) {
        console.error("Error al eliminar el mensaje:", err.message);
        return res
            .status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const sendModeratorRequest = async (req, res) => { //En req.body va el id del usuario al que le quiero mandar la solicitud
    try {
        const community = await Community.findById(req.params.id);
        if (!community) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
        }
        if (!community.users.includes(req.body.user_id)) {
            return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "No podes enviar solicitud de ser moderador a un usuario que no esta en la comunidad" });
        }
        const user_to_send_request = await User.findById(req.body.user_id);        
        await user_to_send_request.updateOne({$push: {pending_moderator_request: community.name}})   // mi propio nombre

        return res.status(HttpCodesEnum.OK).json({ message: "Solicitud enviada"})
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

// const addModerator = async (req, res) => {
//     try {
//         const community = await Community.findById(req.params.id);
//         if (!community) {
//             return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Comunidad no encontrada"})
//         }
//         if (!community.users.includes(req.body.user_id)) {
//             return res.status(HttpCodesEnum.FORBBIDEN).json({ message: "Usuario no esta en comunidad" });
//         }

//         const user = User.findById(req.body.user_id)
//         if (!user) {
//             return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
//         }

//         await community.updateOne({$pull: {moderators: req.body.user_id}})

//         return res.status(HttpCodesEnum.OK).json({ details: {...otherDetails}})
//     } catch (err) {
//         return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
//     }
// }


module.exports = {
    getAllCommunities,
    createCommunity,
    joinCommunity,
    getCommunity,
    getCommunityByName,
    getCommunityByBook,
    getCommunityByGender,
    exitCommunity,
    addMessageToCommunity,
    deleteCommunity,
    joinCommunityAsMod,
    deleteMessageToCommunity,
    renameCommunity,
    sendModeratorRequest,
    // addModerator
}