export class Grammar 
{
    terminals: Array<[string, string]> = new Array;
    constructor(input: string)
    {
        //this.terminals = [];
        let initarray = input.split('\n');
        let valset : Set<string> = new Set();
        this.terminals.push(["WHITESPACE","\\s+"]);
        for (let i = 0; i < initarray.length; i++)
        {
            if (initarray[i] != '')
            {
                if (!initarray[i].includes(" -> "))
                    throw new Error("Incorrect symbol definition detected!");
                let temparray = initarray[i].split(" -> ");
                //console.log(temparray[0]);
                if (valset.has(temparray[0]))
                    throw new Error("Duplicate symbol detected!");
                valset.add(temparray[0]);
                try
                {
                    new RegExp(temparray[1])
                }
                catch(e)
                {
                    throw new Error("Invalid regex detected!");
                }
                console.log(temparray[0]);
                this.terminals.push([temparray[0], temparray[1]]);
            }
        }
    }
}