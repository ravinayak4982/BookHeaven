const router = require("express").Router();
const User = require("../models/user.js");
const { authenticatToken } = require("./userAuth.js");


//add book to fav;
router.put("/add-book-to-favourite", authenticatToken, async(req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if (isBookFavourite) {
            return res.status(200).json({ message: "Book is already in favourite" });
        }
        await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
       return res.status(200).json({ message: "Book added to  favourite" });


    } catch (error) {
        res.status(500).json({ message: "INternal server error" });
        
    };
});


// remove book favourite
router.put("/remove-book-to-favourite", authenticatToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if (isBookFavourite) {
            await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
        }
        return res.status(200).json({ message: "Book remove to  favourite" });
    } catch (error) {
        res.status(500).json({ message: "INternal server error" });

    };
});

// get favourite books for a particular user
router.get("/get-favourite-books", authenticatToken, async(req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBook = userData.favourites;
        return res.json({
            status: "Sucess",
            data: favouriteBook,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error ocured" });
    }
});  

module.exports = router;