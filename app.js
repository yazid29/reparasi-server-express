require('dotenv').config();
const express= require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3050;
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

app.use(logger);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/",express.static(path.join(__dirname,"/public")));

app.use("/",require("./routes/root"));
app.all("*",(req,res)=>{
    res.status(404);
    // jika akses dari browser
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname,"../views","404.html"));
    }
    // jika akses dari postman
    else if (req.accepts("json")){
        res.json({error:"404 Not Found"});
    }
    // jika akses dari luar browser/postman
    else{
        res.type("txt").send("404 Not Found");
    }
});

app.use(errorHandler);
app.listen(port,()=>console.log(`Server started on port ${port}`));