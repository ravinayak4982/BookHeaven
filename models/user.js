const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/user-profile-icon.png",
        
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books",
        },
    ],
    favourites: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books",
        },
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "order",
        },
    ],
    
}, { timestamps: true }
);

module.exports = mongoose.model("user", user);