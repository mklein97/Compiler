"use strict";
exports.__esModule = true;
var fs = require("fs");
var parser_1 = require("./parser");
function main() {
    var data = fs.readFileSync("tests.txt", "utf8");
    var tests = JSON.parse(data);
    var numPassed = 0;
    var numFailed = 0;
    for (var i = 0; i < tests.length; ++i) {
        var name_1 = tests[i]["name"];
        var grammarSpec = tests[i]["grammarSpec"];
        var expected = tests[i]["table"];
        var nonterminals = tests[i]["nonterminals"];
        var terminals = tests[i]["terminals"];
        var T = parser_1.computeTable(grammarSpec);
        var html = makeTable(T);
        fs.writeFileSync(name_1 + ".table.html", html);
        if (!tablesAreSame(expected, T, terminals, nonterminals)) {
            console.log("Test " + name_1 + " failed");
            ++numFailed;
            break;
        }
        else
            ++numPassed;
    }
    console.log(numPassed + " tests OK" + "      " + numFailed + " tests failed");
    return numFailed == 0;
}
function makeTable(T) {
    var L = [];
    L.push("<!DOCTYPE html>");
    L.push("<html><head><meta charset=utf8>");
    L.push("<style>");
    L.push("td , th { border: 1px solid black; }");
    L.push("div.production { white-space: nowrap; }");
    L.push("</style>");
    L.push("</head><body>");
    L.push("<table style='border-collapse:collapse'>");
    var terminalSet = new Set();
    var terminals = [];
    var nonterminals = [];
    T.forEach(function (value, key) {
        nonterminals.push(key);
    });
    nonterminals.forEach(function (x) {
        T.get(x).forEach(function (value, key) {
            terminalSet.add(key);
        });
    });
    terminalSet.forEach(function (x) {
        terminals.push(x);
    });
    terminals.sort();
    nonterminals.sort();
    L.push("<tr>");
    L.push("<th></th>");
    terminals.forEach(function (t) {
        L.push("<th>" + t + "</th>");
    });
    L.push("</tr>");
    nonterminals.forEach(function (n) {
        L.push("<tr>");
        L.push("<td>" + n + "</td>");
        terminals.forEach(function (t) {
            var tstr = "";
            if (T.get(n).has(t)) {
                var lst = T.get(n).get(t);
                lst.forEach(function (x) {
                    tstr += "<div class='production'>";
                    var ll = [];
                    x.forEach(function (sym) {
                        ll.push(sym);
                    });
                    tstr += ll.join(" ");
                    tstr += "</div>";
                });
            }
            L.push("<td>" + tstr + "</td>");
        });
        L.push("</tr>");
    });
    L.push("</table></body></html>");
    return L.join("\n");
}
function tablesAreSame(table1, table2, terminals, nonterminals) {
    return nonterminals.every(function (n) {
        return terminals.every(function (t) {
            var p1;
            var p2;
            if (table1[n] === undefined) {
                p1 = undefined;
            }
            else {
                if (table1[n][t] === undefined) {
                    p1 = undefined;
                }
                else {
                    p1 = table1[n][t];
                }
            }
            if (!table2.has(n))
                p2 = undefined;
            else {
                if (!table2.get(n).has(t)) {
                    p2 = undefined;
                }
                else {
                    p2 = table2.get(n).get(t);
                }
            }
            var match = true;
            ;
            match = match && ((p1 === undefined) === (p2 === undefined));
            if (p1 !== undefined) {
                var lst2 = [];
                p2.forEach(function (x) {
                    lst2.push(x);
                });
                match = match && listOfListsEqual(p1, lst2);
            }
            if (!match) {
                console.log("Row " + n + " column " + t + ":");
                console.log("    ", p1);
                console.log("    ", lst2);
                return false;
            }
            else
                return true;
        });
    });
}
function listOfListsEqual(L1a, L2a) {
    var L1 = [];
    var L2 = [];
    L1a.forEach(function (x) {
        x.forEach(function (y) {
            L1.push(y);
        });
    });
    L2a.forEach(function (x) {
        x.forEach(function (y) {
            L2.push(y);
        });
    });
    L1.sort();
    L2.sort();
    if (L1.length !== L2.length)
        return false;
    for (var i = 0; i < L1.length; ++i) {
        if (L1[i] !== L2[i])
            return false;
    }
    return true;
}
main();
