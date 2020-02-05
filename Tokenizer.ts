import {Token} from "./Token"
import {Grammar} from "./Grammar"

export class Tokenizer
{
    grammar: Grammar;
    inputData: string;
    lineNumber: number;
    idx: number;    //index of next unparsed char in inputData

    constructor( grammar: Grammar )
    {
        this.grammar = grammar;
        this.idx = 0;
        this.lineNumber = 1;
    }
    setInput( inputData: string )
    {
        this.inputData = inputData;
        this.idx = 0;
        this.lineNumber = 1;
    }
    next(): Token 
    {
        if( this.idx >= this.inputData.length-1 ){
            //special "end of file" metatoken
            return new Token("$",undefined,this.lineNumber);
        }
        
        for(let i=0;i<this.grammar.terminals.length;++i)
        {
            let terminal = this.grammar.terminals[i];
            let sym = terminal[0];
            //console.log(terminal[1]);
            let rex = new RegExp(terminal[1], "gy");     //RegExp
            rex.lastIndex = this.idx;   //tell where to start searching
            //console.log(String(this.grammar.terminals[i]));
            let m = rex.exec(this.inputData);   //do the search
            if( m )
            {
                //m[0] contains matched text as string
                let lexeme = m[0];
                this.idx += lexeme.length;
                let templine = this.lineNumber;
                this.lineNumber += lexeme.split('\n').length-1;
                if( sym !== "WHITESPACE" && sym !== "COMMENT" )
                {
                    //return new Token using sym, lexeme, and line number
                    return new Token(sym, lexeme, templine);
                } 
                else 
                {
                    //skip whitespace and get next real token
                    return this.next();
                }
            }
        }
        //no match; syntax error
        throw new Error("No match!");
    }
}