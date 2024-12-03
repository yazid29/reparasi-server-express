const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        // await mongoose.connect(process.env.DATABASE_URI_ATLAS);
        console.log("Database connected");
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

module.exports = connectDB;