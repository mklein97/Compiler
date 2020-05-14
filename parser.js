"use strict";
exports.__esModule = true;
var Grammar_1 = require("./Grammar");
function computeTable(gram) {
    var table = new Map();
    var g = new Grammar_1.Grammar(gram);
    var follow = g.getFollow();
    g.nonTerminals.forEach(function (N) {
        var productions = N[1].split("|");
        table.set(N[0], new Map());
        productions.forEach(function (prods) {
            var P = prods.trim().split(" ");
            if (P[0] === "lambda")
                P = new Array();
            findfirst(P, follow.get(N[0]), g).forEach(function (s) {
                var temp = new Array();
                if (!table.get(N[0]).has(s)) {
                    temp.push(P);
                    table.get(N[0]).set(s, temp);
                }
                else
                    table.get(N[0]).get(s).push(P);
            });
        });
    });
    return table;
}
exports.computeTable = computeTable;
function findfirst(P, e, gram) {
    var s = new Set();
    var first = gram.getFirst();
    for (var i = 0; i < P.length; ++i) {
        var sym = P[i];
        if (first.get(sym) === undefined)
            continue;
        s = union(s, first.get(sym));
        if (!gram.getNullable().has(sym))
            return s;
    }
    e.forEach(function (sym) {
        s.add(sym);
    });
    return s;
}
function union(setA, setB) {
    var union = new Set(setA);
    setB.forEach(function (v) {
        union.add(v);
    });
    return union;
}
