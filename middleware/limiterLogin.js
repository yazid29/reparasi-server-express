const rateLimit = require("express-rate-limit");
const {logEvents} = require("./logger");

const limiterLogin = rateLimit({
    windowMs: 90 * 1000,
    max: 3,
    message: {message: "Too many login attempts, please try again after 90 seconds"},
    handler: (req, res, next, options) => {
        logEvents(`Too many login attempts! ${options.message.message}
            \t${req.method}\t${req.url}`,'errLog.log');
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = limiterLogin;