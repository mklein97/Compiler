"use strict";
exports.__esModule = true;
var Node_1 = require("./Node");
var Grammar = /** @class */ (function () {
    function Grammar(input) {
        this.terminals = new Array;
        this.nonTerminals = new Array;
        //this.terminals = [];
        var initarray = input.split('\n\n');
        var s = new Set();
        this.terminals.push(["WHITESPACE", RegExp("\\s+")]);
        var terms = initarray[0].split("\n");
        var nonTerms = initarray[1].split("\n");
        for (var i = 0; i < terms.length; i++) {
            if (terms[i].length == 0)
                continue;
            else if (!terms[i].includes(" -> "))
                throw new Error("No Identifiers");
            var ID = terms[i].split(" -> ");
            if (s.has(ID[0]))
                throw new Error("Duplicate variable");
            else if (ID[0] == "")
                throw new Error("Empty ID");
            if (s.has(ID[1]))
                throw new Error("Duplicate Regex");
            else if (ID[1] == "")
                throw new Error("Empty Regex");
            try {
                new RegExp(ID[1]);
            }
            catch (_a) {
                throw new Error("Invalid regular expression");
            }
            if (!s.has(ID[0]))
                s.add(ID[0]);
            this.terminals[i] = [ID[0], RegExp(ID[1])];
        }
        for (var i = 0; i < nonTerms.length; i++) {
            if (nonTerms[i].length == 0)
                continue;
            else if (!nonTerms[i].includes(" -> "))
                throw new Error("No junction");
            var ID = nonTerms[i].split(" -> ");
            if (ID[0] == "")
                throw new Error("Empty ID");
            else if (ID[1] == "")
                throw new Error("Empty nonterminal");
            var found = this.nonTerminals.findIndex(function (e) { return e[0] === ID[0]; });
            if (found !== -1) {
                var nonterm = this.nonTerminals[found];
                this.nonTerminals[found][1] = nonterm + ' | ' + ID[1];
            }
            else if (!s.has(ID[0]))
                s.add(ID[0]);
            this.nonTerminals[i] = [ID[0], ID[1]];
        }
        var used = new Set();
        var start = new Node_1.Node("expr");
        this.dfs(start, used);
        if (s !== undefined) {
            s.forEach(function (def) {
                if (!used.has(def))
                    throw new Error(def + " was defined but is not used");
            });
        }
        if (used != undefined) {
            used.forEach(function (v) {
                if (v !== '' && !s.has(v))
                    throw new Error(v + " is used but is not defined");
            });
        }
    }
    Grammar.prototype.dfs = function (node, used) {
        var _this = this;
        used.add(node.label);
        var found = this.nonTerminals.find(function (nt) { return nt[0] === node.label; });
        if (found !== undefined) {
            var str = found[1];
            str = str.replace('|', '');
            str = str.replace(',', ' ');
            str.split(new RegExp('\\b')).forEach(function (t) {
                var tmp = t.trim();
                if (tmp !== '') {
                    var newNode = new Node_1.Node(tmp);
                    node.n.push(newNode);
                }
            });
        }
        if (node.n !== undefined) {
            node.n.forEach(function (t) {
                if (!used.has(t.label))
                    _this.dfs(t, used);
            });
        }
    };
    return Grammar;
}());
exports.Grammar = Grammar;
