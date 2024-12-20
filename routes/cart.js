const router = require("express").Router();
const User = require("../models/user.js");
const { authenticatToken } = require("./userAuth.js");

//put book to cart
router.put("/add-to-cart", authenticatToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookincart = userData.cart.includes(bookid);
        if (isBookincart) {
            return res.json({
                status: "success",
                message: "Book is already in your cart",
            });
        };
            await User.findByIdAndUpdate(id, {
                $push: { cart: bookid },
            });
        return res.json({
            status: "success",
            message: "Book added to cart",

        });   
        
    } catch (error) {
        console.log(error);
    }
});

//remove from cart
router.put("/remove-from-cart/:bookid", authenticatToken, async (req, res) => {
    try {
        const { bookid} = req.params;
        const { id } = req.headers;
      
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid },
        });
        return res.json({
            status: "success",
            message: "Book removed from cart",

        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

//get a  cart

router.get("/get-user-cart", authenticatToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();
        return res.json({
            status: "success",
           data:cart,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

module.exports = router;