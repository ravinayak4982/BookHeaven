const router = require("express").Router();
const { authenticatToken } = require("./userAuth.js");
const Book = require("../models/book.js");
const Order = require("../models/order.js");
const User = require("../models/user.js");



//get place order
router.post("/place-order", authenticatToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;
        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDatafromDb = await newOrder.save();
            //saving order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDatafromDb._id },
            });
            //clrearing cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id },
            });
        }
        return res.json({
            status: "Success",
            message: "Order placed Successfully",
        });
    } catch (error) {
        console.log(error);
    }
});

//get order history of particular user
router.get("/get-order-history", authenticatToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });
        const orderData = userData.orders.reverse();
        return res.json({
            status: "Success",
            data: orderData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

// get -all-order admin
router.get("/get-all-orders", authenticatToken, async (req, res) => {
    try {
        const userData = await Order.find()
            .populate({
                path: "book",
            })
            .populate({
                path: "user",
            })
            .sort({ cretedAt: -1 });
        return res.json({
            status: "Success",
            data: userData,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

//update order admin
router.put("/update-status/:id", authenticatToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, { status: req.body.status });
        return res.json({
            status: "Success",
            message: "status update successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occured" });
    }
});

module.exports = router;