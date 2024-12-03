const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DATABASE_URI);
        // await mongoose.connect(process.env.DATABASE_URI_ATLAS);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

module.exports = connectDB;