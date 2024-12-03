const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
        unique: true,
        min: 3,
        max: 25
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    books: {
        type: Array,
        default: []
    },
    readBooks: {
        type: Array,
        default: []
    },
    toReadBooks: {
        type: Array,
        default: []
    },
    readingBooks: {
        type: Array,
        default: []
    },
    photo_url: {
        type: String,
        default: "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg"  // es una imagen sin nada (?
    },
    address: {
        type: String,
        default: "Campana, Buenos Aires"
    },
    birth_date: {
        type: Date
    },
    writers: {
        type: Array,
        default: []
    },
    genres: {
        type: Array,
        default: []
    },
    friends: {
        type: Array,
        default: [],
    },
    pending_friend_request: {
        type: Array,
        default: []
    },
    pending_moderator_request: {
        type: Array,
        default: []
    },
    privacy_level: {
        type: Number,
        default: 0
    },
    blocked_users: {
        type: Array,
        default: []
    },
    last_time_in_community: {
        type: Date
    },
    myBookArrays: {
        type: Array,
        default: []
    },
    communities: {
        type: Array,
        default: []
    },
    level: {
        type: Number,
        default: 0
    },
    is_banned: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);