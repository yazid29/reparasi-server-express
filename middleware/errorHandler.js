const {logEvents} = require('./logger');
const errorHandler = (err,req,res,next)=>{
    logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.url}`,'errLog.log');

    const status = res.statusCode ?? 500;
    if (!res.headersSent) { // Check if headers have already been sent
        res.status(status).json({ message: err.message });
    }
};

module.exports = errorHandler;