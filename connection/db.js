const mongoose = require('mongoose');

const con = async () => {
    try {
        await mongoose.connect(`${process.env.DBS}`)
            console.log("Connected to MongoDB");
        }
     catch (error) {
        console.log(error); 
    }

}
con();