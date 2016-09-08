'use strict';
var path = require('path');
var APIError = require(path.join(__dirname, 'error'));

module.exports = function(req, res, next) {
    function sendError(code, data) {
        if (code instanceof APIError) {
            return sendError(code.code, code.data);
        }
        if (typeof code === 'number') {
            return res.status(code).send(data || {});
        }

        var logger = req.app.get('logger') || console;
        var config = req.app.get('config');
        logger.error(new Date, code);
        var stack = code.stack;
        if (stack) { console.error(stack); }
        res.status(500).send(code);
    }

    res.APIError = APIError;
    res.sendError = sendError;
    next();
};