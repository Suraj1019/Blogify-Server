const fs = require('fs');

let errorLogger = (err, req, res, next) => {
    if (err) {
        let logMessage = "" + new Date() + " " + err.stack + "\n";
        fs.appendFile('ErrorLogger.txt', logMessage, (error) => {
            if (error) console.log('Failed in logging error')
        })
        res.status(err.status || 500)
        res.json({ message: err.message })
    }
    next();
}

module.exports = errorLogger;