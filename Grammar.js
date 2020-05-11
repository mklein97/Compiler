"use strict";
exports.__esModule = true;
var Node_1 = require("./Node");
var Grammar = /** @class */ (function () {
    function Grammar(input) {
        this.terminals = new Array();
        this.nonTerminals = new Array();
        this.nullables = new Set();
        var initarray = input.split('\n');
        var s = new Set();
        //this.terminals.push(["WHITESPACE", RegExp("\\s+")]);
        var terms = new Array();
        var nonTerms = new Array();
        var isTerm = true;
        initarray.forEach(function (e) {
            if (e.length != 0) {
                if (isTerm)
                    terms.push(e);
                else
                    nonTerms.push(e);
            }
            else
                isTerm = false;
        });
        for (var i = 0; i < terms.length; i++) {
            if (terms[i].length === 0)
                continue;
            else if (!terms[i].includes(" -> "))
                throw new Error("No identifiers");
            var ID = terms[i].split(" -> ");
            if (s.has(ID[0]))
                throw new Error("Duplicate variable");
            else if (ID[0] === "")
                throw new Error("No ID");
            if (s.has(ID[1]))
                throw new Error("Duplicate Regex");
            else if (ID[1] === "")
                throw new Error("No Regex");
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
            if (nonTerms[i].length === 0)
                continue;
            else if (!nonTerms[i].includes(" -> "))
                throw new Error("No junction");
            var ID = nonTerms[i].split(" -> ");
            if (ID[0] === "")
                throw new Error("No ID");
            else if (ID[1] === "")
                throw new Error("No nonterminal");
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
            s.forEach(function (v) {
                if (!used.has(v)) { }
                //throw new Error(def + " was defined but is not used");
            });
        }
        if (used !== undefined) {
            used.forEach(function (v) {
                if (v !== '' && !s.has(v)) { }
                //throw new Error(v + " is used but is not defined");
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
    Grammar.prototype.getNullable = function () {
        var _this = this;
        this.nullables = new Set();
        var done = false;
        while (1) {
            done = true;
            this.nonTerminals.forEach(function (v) {
                if (!_this.nullables.has(v[0])) {
                    var productions = v[1].split("|");
                    productions.forEach(function (p) {
                        var prods = p.trim().split(" ");
                        if (prods.every(function (s) { return _this.nullables.has(s) || s == "lambda"; })) {
                            _this.nullables.add(v[0]);
                            done = false;
                        }
                    });
                }
            });
            if (done)
                break;
        }
        return this.nullables;
    };
    Grammar.prototype.getFirst = function () {
        var _this = this;
        var first = new Map();
        this.nonTerminals.forEach(function (v) {
            first.set(v[0], new Set());
        });
        this.terminals.forEach(function (v) {
            first.set(v[0], new Set());
            first.get(v[0]).add(v[0]);
        });
        this.nullables = this.getNullable();
        var _loop_1 = function () {
            var done = false;
            this_1.nonTerminals.forEach(function (v) {
                var productions = v[1].split("|");
                productions.forEach(function (p) {
                    var prods = p.trim().split(" ");
                    if (prods[0] === "lambda")
                        prods = new Array();
                    prods.every(function (item) {
                        first.get(item).forEach(function (val) {
                            if (!first.get(v[0]).has(val)) {
                                done = true;
                                first.get(v[0]).add(val);
                            }
                        });
                        return _this.nullables.has(item);
                    });
                });
            });
            if (!done)
                return "break";
        };
        var this_1 = this;
        while (1) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        return first;
    };
    return Grammar;
}());
exports.Grammar = Grammar;
