import fs from 'fs';
import readline from 'readline';

export const getStart = (table: string) =>
{
    if(table == "movies")
    {
        return `BEGIN TRANSACTION; \nINSERT INTO ${table}(id, title, year)\nVALUES\n`
    }
   return `BEGIN TRANSACTION; \nINSERT INTO ${table} VALUES\n`
}

const main =async () => {
    const end = "COMMIT;\n"
    const fileStream = fs.createReadStream('movies-pg.sql');

    const tables = [
        "movies",
        "people",
        "stars",
        "ratings",
        "directors"
    ]
    let counter = 0
    let fileIndex = 0
    let totalIndex = 0
    let currentTable: string = ""
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let wasInit = false;
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.

        if(counter<50000)
        {
            if(counter%5000 === 0)
            {
                console.log(counter)
            }
            counter ++
            if(line.includes("-- create"))
            {
                if(currentTable!="")
                {
                    fs.appendFileSync(`./out/${totalIndex}-${currentTable}-${fileIndex}.sql`, "\nON CONFLICT DO NOTHING;\n"+end)
                    counter = 0
                    fileIndex = 0
                    totalIndex++
                    wasInit = false;
                }
                currentTable = line.split(" ")[2]
                fs.appendFileSync(`./out/${totalIndex}-${currentTable}-${fileIndex}.sql`, getStart(currentTable))
            }else{
                if((counter === 2 || counter === 1) && !wasInit)
                {
                    fs.appendFileSync(`./out/${totalIndex}-${currentTable}-${fileIndex}.sql`,  "" + line)
                    wasInit = true
                }else{
                    fs.appendFileSync(`./out/${totalIndex}-${currentTable}-${fileIndex}.sql`,  ",\n" + line)
                }
            }
        }else{
            fs.appendFileSync(`./out/${totalIndex}-${currentTable}-${fileIndex}.sql`, ",\n"+line+"\nON CONFLICT DO NOTHING;\n")
            fs.appendFileSync(`./out/${totalIndex}-${currentTable}-${fileIndex}.sql`, end)
            fileIndex++
            counter = 0
            fs.appendFileSync(`./out/${totalIndex}-${currentTable}-${fileIndex}.sql`, getStart(currentTable))
            console.log(`./out/${totalIndex}-${currentTable}-${fileIndex}.sql`)
            wasInit = false;
        }
    }
}
main();