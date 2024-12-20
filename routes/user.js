const router = require("express").Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticatToken } = require("./userAuth.js");
//signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        //check username length is more than 3
        if (username.length < 4) {
            return res.status(400).json({ message: "username length shouyld be freater than 3" });
        }
        //check username already exist
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "username already exist" });

        }
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "email already exist" });
        }
        // check passwrd length
        if (password.length < 5) {
            return res.status(400).json({ message: "password length shouyld be freater than 3" });
        }
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });
        await newUser.save();
        return res.status(200).json({ message: "signup successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
//sign in
router.post("/login", async (req, res) => {
try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const authClaims = {
        name: existingUser.username,
        role: existingUser.role,
    };
    const token = jwt.sign(authClaims, "bookStore123", { expiresIn: "30d" });

    return res.status(200).json({
        id: existingUser._id,
        role: existingUser.role,
        token: token,
    });
} catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
}
});

//get user information
router.get("/get-user-information", authenticatToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

//update address
router.put("/update-address", authenticatToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "Address updated" });
    } catch (error) {
        res.status(500).json({ message: "internal server token" });
    }
});

module.exports = router;

