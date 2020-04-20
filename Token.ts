export class Token 
{
    sym: string;
    lexeme: string;
    line: number;
    constructor(sym:string, lexeme:string, line:number)
    {
        this.sym = sym;
        this.lexeme = lexeme;
        this.line = line;
    }
}