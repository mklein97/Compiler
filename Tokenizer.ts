import {Token} from "./Token"
import {Grammar} from "./Grammar"

export class Tokenizer
{
    grammar: Grammar;
    inputData: string;
    currentLine: number;
    idx: number;    //index of next unparsed char in inputData

    constructor( grammar: Grammar )
    {
        this.grammar = grammar;
    }
    setInput( inputData: string )
    {
        ...prepare for new parse...
    }
    next(): Token 
    {
        ...return next token...
        ...advance this.idx...
        ...adjust this.currentLine...
    }
}