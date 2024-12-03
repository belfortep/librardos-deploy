const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HttpCodesEnum } = require('../enum/httpCodes');
const Message = require('../models/Message');


const getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        return res.status(HttpCodesEnum.OK).json(message);
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

const updateMessageById = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, {$set: req.body}, {new:true})
        if (!message) {
            return res.status(HttpCodesEnum.NOT_FOUND).json({message: "Usuario no encontrado"})
        }
        
        return res.status(HttpCodesEnum.OK).json(message)
    } catch (err) {
        return res.status(HttpCodesEnum.SERVER_INTERNAL_ERROR).json({ message: err.message });
    }
}

module.exports = {
    getMessageById,
    updateMessageById
}
