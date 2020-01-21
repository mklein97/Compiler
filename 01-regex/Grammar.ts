
export class Grammar 
{
    constructor(input: string)
    {
        let initarray = input.split('\n');
        //console.log(initarray);
        let valset : Set<string> = new Set();
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
                    //console.log(temparray[1]);
                    new RegExp(temparray[1])
                }
                catch(e)
                {
                    throw new Error("Invalid regex detected!");
                }
            }
        }
    }
}