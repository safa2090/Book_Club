const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    addedBy: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        minLength: [3, "Title must be at least 3 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [5, "Description must be at least 5 characters"]
    },
    likedBy: {
        type: Array
    }
}, {timestamps: true});


const Book = mongoose.model("Book", BookSchema)
module.exports = Book;