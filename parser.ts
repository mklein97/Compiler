import {Grammar} from "./Grammar"

export function computeTable(gram: string)
{
    let table = new Map<string, Map<string, any>>();
    let g = new Grammar(gram);
    let follow = g.getFollow();
    g.nonTerminals.forEach(N => 
    {
        let productions = N[1].split("|");
        table.set(N[0], new Map<string, Array<string>>());
        productions.forEach(prods => 
        {
            let P = prods.trim().split(" ");
            if (P[0] === "lambda")
                P = new Array();
            findfirst(P, follow.get(N[0]), g).forEach(s => 
            {
                let temp = new Array<Array<string>>();
                if (!table.get(N[0]).has(s))
                {
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

function findfirst( P: string[], e: any, gram: Grammar)
{
    let s : Set<string> = new Set();
    let first = gram.getFirst();
    for(let i = 0; i < P.length; ++i)
    {
        let sym = P[i];
        if (first.get(sym) === undefined)
            continue;
        s = union(s, first.get(sym));
        if(!gram.getNullable().has(sym))
            return s;
    }
    e.forEach( (sym: string) => 
    {
        s.add(sym);
    });
    return s;
}

function union(setA: Set<string>, setB: Set<string>) {
    let union = new Set<string>(setA);
    setB.forEach(v => 
    {
        union.add(v);
    });
    return union
}