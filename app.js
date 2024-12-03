require('dotenv').config();
const express= require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3050;
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');

connectDB();
app.use(logger);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/",express.static(path.join(__dirname,"/public")));

app.use("/",require("./routes/root"));
app.use("/users",require("./routes/userRoutes"));
app.use("/tickets",require("./routes/ticketRoutes"));
app.all('*', (req, res) => {
    // jika akses dari browser
    if(req.accepts().includes('text/html')){
        res.status(404);
        res.sendFile(path.join(__dirname,"views","404.html"));
    }
    // jika akses dari postman
    else {
        res.json({error:"404 Not Found"});
    }
});
app.use(errorHandler);

mongoose.connection.once('open',()=> {
    console.log('Connected to MongoDB')
    app.listen(port,()=>console.log(`Server listening at http://localhost:${port}`));
});
mongoose.connection.on('error',err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoDBErrLog.log');
});