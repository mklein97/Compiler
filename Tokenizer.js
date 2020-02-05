"use strict";
exports.__esModule = true;
var Token_1 = require("./Token");
var Tokenizer = /** @class */ (function () {
    function Tokenizer(grammar) {
        this.grammar = grammar;
        this.idx = 0;
        this.lineNumber = 1;
    }
    Tokenizer.prototype.setInput = function (inputData) {
        this.inputData = inputData;
        this.idx = 0;
        this.lineNumber = 1;
    };
    Tokenizer.prototype.next = function () {
        if (this.idx >= this.inputData.length - 1) {
            //special "end of file" metatoken
            return new Token_1.Token("$", undefined, this.lineNumber);
        }
        for (var i = 0; i < this.grammar.terminals.length; ++i) {
            var terminal = this.grammar.terminals[i];
            var sym = terminal[0];
            //console.log(terminal[1]);
            var rex = new RegExp(terminal[1], "gy"); //RegExp
            rex.lastIndex = this.idx; //tell where to start searching
            //console.log(String(this.grammar.terminals[i]));
            var m = rex.exec(this.inputData); //do the search
            if (m) {
                //m[0] contains matched text as string
                var lexeme = m[0];
                this.idx += lexeme.length;
                var templine = this.lineNumber;
                this.lineNumber += lexeme.split('\n').length - 1;
                if (sym !== "WHITESPACE" && sym !== "COMMENT") {
                    //return new Token using sym, lexeme, and line number
                    return new Token_1.Token(sym, lexeme, templine);
                }
                else {
                    //skip whitespace and get next real token
                    return this.next();
                }
            }
        }
        //no match; syntax error
        throw new Error("No match!");
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
