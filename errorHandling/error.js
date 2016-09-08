'use strict';
function APIError (code, data) {
    this.code = code;
    this.data = data;
}

module.exports = APIError;