import { Node } from "./Node"

export class Grammar 
{
    terminals: Array<[string, RegExp]> = new Array();
    nonTerminals: Array<[string, string]> = new Array();
    nullables: Set<string> = new Set<string>();
    constructor(input: string)
    {
        let initarray = input.split('\n');
        let s : Set<string> = new Set();
        //this.terminals.push(["WHITESPACE", RegExp("\\s+")]);
        let terms: Array<string> = new Array();
        let nonTerms: Array<string> = new Array();
        let isTerm = true;
        initarray.forEach(e => 
        {
            if (e.length != 0) 
            {
                if (isTerm)
                    terms.push(e);
                else
                    nonTerms.push(e)
            }
            else
                isTerm = false;
        });
        for (var i = 0; i < terms.length; i++) 
        {
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
            try
            {
                new RegExp(ID[1])
            }
            catch 
            {
                throw new Error("Invalid regular expression")
            }
            if (!s.has(ID[0]))
                s.add(ID[0]);
            this.terminals[i] = [ID[0], RegExp(ID[1])];
        }
        for (var i = 0; i < nonTerms.length; i++) 
        {
            if (nonTerms[i].length === 0) 
                continue;
            else if (!nonTerms[i].includes(" -> "))
                throw new Error("No junction");
            var ID = nonTerms[i].split(" -> ");
            if (ID[0] === "")
                throw new Error("No ID");
            else if (ID[1] === "")
                throw new Error("No nonterminal");
            const found: number = this.nonTerminals.findIndex(e => e[0] === ID[0])
            if (found !== -1) 
            {
                var nonterm = this.nonTerminals[found];
                this.nonTerminals[found][1] = nonterm + ' | ' + ID[1];
            }
            else if (!s.has(ID[0]))
                s.add(ID[0]);
            this.nonTerminals[i] = [ID[0], ID[1]];
        }
        let used: Set<string> = new Set();
        let start: Node = new Node("expr");
        this.dfs(start, used);
        if (s !== undefined) 
        {
            s.forEach(v => 
            {
                if (!used.has(v)){}
                    //throw new Error(def + " was defined but is not used");
            });
        }
        if (used !== undefined) 
        {
            used.forEach(v => 
            {
                if (v !== '' && !s.has(v)){}
                    //throw new Error(v + " is used but is not defined");
            });
        }
    }
    dfs(node: Node, used: Set<string>) 
    {
        used.add(node.label);
        const found = this.nonTerminals.find(nt => nt[0] === node.label);
        if (found !== undefined) 
        {
            let str = found[1];
            str = str.replace('|', '');
            str = str.replace(',', ' ');
            str.split(new RegExp('\\b')).forEach(t => 
            {
                let tmp = t.trim();
                if (tmp !== '') 
                {
                    let newNode: Node = new Node(tmp);
                    node.n.push(newNode);
                }
            });
        }
        if (node.n !== undefined) 
        {
            node.n.forEach((t: Node) => 
            {
                if (!used.has(t.label))
                    this.dfs(t, used);
            });
        }
    }
    getNullable() 
    {
        this.nullables = new Set();
        let done = false;
        while (1) 
        {
            done = true;
            this.nonTerminals.forEach(v => 
            {
                if (!this.nullables.has(v[0])) 
                {
                    let productions = v[1].split("|");
                    productions.forEach(p => 
                    {
                        let prods = p.trim().split(" ");
                        if (prods.every(s => this.nullables.has(s) || s == "lambda")) 
                        {
                            this.nullables.add(v[0]);
                            done = false;
                        }
                    })
                }
            });
            if (done)
                break;
        }
        return this.nullables;
    }
    getFirst()
    {
        let first = new Map<string, Set<string>>();
        this.nonTerminals.forEach(v => 
        {
            first.set(v[0], new Set<string>());
        });
        this.terminals.forEach(v => 
        {
            first.set(v[0], new Set<string>())
            first.get(v[0]).add(v[0]);
        });
        this.nullables = this.getNullable();
        while (1)
        {
            let done = false;
            this.nonTerminals.forEach(v => 
            {
                let productions = v[1].split("|");
                productions.forEach(p => 
                {
                    let prods = p.trim().split(" ");
                    if (prods[0] === "lambda")
                        prods = new Array();
                    prods.every(item => 
                    {
                        first.get(item).forEach(val => 
                        {
                            if (!first.get(v[0]).has(val))
                            {
                                done = true;
                                first.get(v[0]).add(val);
                            }
                        });
                        return this.nullables.has(item);
                    }); 
                });
            });
            if (!done)
                break;
        }
        return first;
    }
}