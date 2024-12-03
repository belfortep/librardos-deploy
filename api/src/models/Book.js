const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: false,
    },
    gender: {
        type: String,
        require: false,
    },
    num_pages: {
        type: Number,
        require: false,
    },
    editorial: {
        type: String,
        require: false,
    },
    year_edition: {
        type: Date,
        required: false
    },
    date_edition: {
        type: Date,
        required: false
    },
    isbn: {
        type: String,
        required: false,
        unique: true
    },
    writer: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },

    comments: {
        type: Array,
        default: []
    },
    scores: [
        {
            score: Number,
            user: String
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model('Book', BookSchema);