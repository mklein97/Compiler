"use strict";
exports.__esModule = true;
var Token = /** @class */ (function () {
    function Token(sym, lexeme, line) {
        this.sym = sym;
        this.lexeme = lexeme;
        this.line = line;
    }
    return Token;
}());
exports.Token = Token;
