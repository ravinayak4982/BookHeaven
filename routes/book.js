const router = require("express").Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticatToken } = require("./userAuth.js");
const Book = require("../models/book.js");

//add book admin
router.post("/add-book", authenticatToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(400).json({ message: "you are not having access to perform admin work" });
        }
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.price,
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({ message: "books added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//update book admin
router.put("/update-book", authenticatToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.title,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        return res.status(200).json({
            message: "Book updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occcured" });
    }
});

//delte book admin
router.delete("/delete-book", authenticatToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message: "Book delete successfully",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

//get all books
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "sucess",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

// get recently added books limit 4
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "sucess",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

//getbook my id books infirmation
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const books = await Book.findById(id);
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

module.exports = router;


