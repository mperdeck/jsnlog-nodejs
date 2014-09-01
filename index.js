// jsnlog-nodejs main file.
//
// Licence and documentation are at:
// http://nodejs.jsnlog.com
//
// Author:
// Matt Perdeck

//---------------------------------------------

// Attempts to deserialize the passed in string as a JSON object.
// If this fails somehow, returns the string itself.
// Otherwise, returns the deserialized object.
var safeDeserialise = function (s) {
    try {
        return JSON.parse(s);
    } catch (e) {
        return s;
    }
};

// Logs the contents of a JSON object.
// JL - The jsnlog object, as returned by
//      var JL = require('jsnlog').JL;
// logJson - A JSON object with log messages received from 
//           jsnlog.js running on the client.
var jsnlog_nodejs = function (JL, logJson) {
    var receivedRequestId = logJson.r;
    var nbrLogEntries = logJson.lg.length;
    var i = 0;

    for (i = 0; i < nbrLogEntries; i++) {
        var receivedLogEntry = logJson.lg[i];
        var loggerName = receivedLogEntry.n;
        var logLevel = receivedLogEntry.l;

        // Build object to log through the server side jsnlog.
        var newLogEngry = {

            // If on the client an object was logged, that will now live in the
            // logEntry as a JSON string. Deserialize it, so when the log entry is
            // logged to for example Mongo, user is able to search on individual fields
            // in the logged object.
            clientMessage: safeDeserialise(receivedLogEntry.m),

            requestId: receivedRequestId,
            clientTimestamp: new Date(receivedLogEntry.t)
        };

        JL(loggerName).log(logLevel, newLogEngry);
    }
}

exports.jsnlog_nodejs = jsnlog_nodejs;


