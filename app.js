const express = require('express'); // Import the express module
const app = express(); // Initialize the express application
const cors = require("cors");

require('dotenv').config();
require("./connection/db.js");
const user = require("./routes/user.js");
const Books = require("./routes/book.js");
const favourite = require("./routes/favourite.js");
const Cart = require("./routes/cart.js");
const Order = require("./routes/order.js");
app.use(cors());


// app.get("/", (req, res) => {
//     res.send("Hello World!");
// })
app.use(express.json());
app.use("/api/v1", user);
app.use("/api/v1", Books);
app.use("/api/v1", favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
