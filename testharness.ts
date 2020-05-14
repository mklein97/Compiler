
declare var require:any;
let fs = require("fs");
import {computeTable} from "./parser";

function main(){
    let data:string = fs.readFileSync("tests.txt","utf8");
    let tests: any = JSON.parse(data);
    let numPassed=0;
    let numFailed=0;
    
    for(let i=0;i<tests.length;++i){
        
        let name: string = tests[i]["name"];
        let grammarSpec = tests[i]["grammarSpec"];
        let expected: { [key:string] : { [key:string]: string[][] } } = tests[i]["table"];
        let nonterminals : string[] = tests[i]["nonterminals"];
        let terminals : string[] = tests[i]["terminals"];
        
        let T = computeTable(grammarSpec);

        let html = makeTable( T );
        fs.writeFileSync( name+".table.html", html );
        
        if( !tablesAreSame( expected, T, terminals, nonterminals ) ){
            console.log("Test "+name+" failed");
            ++numFailed;
            break;
        } 
        else
            ++numPassed;
            
        
    }
    console.log(numPassed+" tests OK"+"      "+numFailed+" tests failed" );
    return numFailed==0;
}

function makeTable( T : Map<string,Map<string,any> > )
{
    let L : string[] = [];
    L.push("<!DOCTYPE html>")
    L.push("<html><head><meta charset=utf8>");
    L.push("<style>");
    L.push("td , th { border: 1px solid black; }");
    L.push("div.production { white-space: nowrap; }");
    L.push("</style>");
    L.push("</head><body>");
    L.push("<table style='border-collapse:collapse'>");
    
    let terminalSet : Set<string> = new Set();
    let terminals : string[] = [];
    let nonterminals: string[] = [];
    T.forEach( ( value: any, key: string ) => {
        nonterminals.push(key);
    });
    nonterminals.forEach( (x:string) => {
        T.get(x).forEach( (value: any, key: string) => {
            terminalSet.add(key);
        });
    });
    terminalSet.forEach( (x:string) => {
        terminals.push(x);
    });
    terminals.sort();
    nonterminals.sort();
    
    L.push("<tr>");
    L.push("<th></th>");
    terminals.forEach( (t:string) => {
        L.push(`<th>${t}</th>`);
    });
    L.push("</tr>");
    
    nonterminals.forEach( (n:string) => {
        L.push("<tr>");
        L.push(`<td>${n}</td>`);
        terminals.forEach( (t:string) => {
            let tstr="";
            if( T.get(n).has(t) ){
                let lst : any[] = T.get(n).get(t);
                lst.forEach( (x: any) => {
                    tstr += "<div class='production'>";
                    let ll : string[] = [];
                    x.forEach( (sym: string) => {
                        ll.push(sym);
                    });
                    tstr += ll.join(" ");
                    tstr += "</div>";
                });
            }
            L.push(`<td>${tstr}</td>`);
        });
        L.push("</tr>");
    });

    
    L.push("</table></body></html>");
    return L.join("\n");
}

function tablesAreSame( table1: { [key:string] : { [key:string]: string[][] } }, table2: Map<string,Map<string,any> >, terminals: string[], nonterminals: string[] ){
    
    
    return nonterminals.every( (n: string) => {
        return terminals.every( (t: string) => {
            var p1: string[][];
            var p2: any;
            if( table1[n] === undefined ){
                p1 = undefined;
            } else {
                if( table1[n][t] === undefined ) {
                    p1 = undefined;
                } else {
                    p1 = table1[n][t];
                }
            }
            if( !table2.has(n) )
                p2 = undefined;
            else{
                if( !table2.get(n).has(t) ){
                    p2 = undefined;
                } else {
                    p2 = table2.get(n).get(t);
                }
            }
            
            let match : boolean = true;;
            
            match = match && ( (p1 === undefined) === (p2 === undefined ) );
            
            if( p1 !== undefined ){
                
                var lst2 : string[] = [];
                p2.forEach( (x: string) => {
                    lst2.push(x);
                });
                
                match = match && listOfListsEqual(p1,lst2);
            }
            
            if( !match ){
                console.log("Row "+n+" column "+t+":");
                console.log("    ",p1);
                console.log("    ",lst2);
                return false;
            } else 
                return true;
        });
    });
}
  
function listOfListsEqual(L1a: any[], L2a: any[] )
{
    let L1: string[] = [];
    let L2: string[] = [];
    L1a.forEach( (x:any[]) => {
        x.forEach( (y:string) => {
            L1.push(y);
        });
    });
    L2a.forEach( (x:any[]) => {
        x.forEach( (y:string) => {
            L2.push(y);
        });
    });
    
    L1.sort();
    L2.sort();
    if( L1.length !== L2.length )
        return false;
    for(let i=0;i<L1.length;++i){
        if( L1[i] !== L2[i] )
            return false;
    }
    return true;
}
 
    


main();
