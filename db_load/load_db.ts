import fs from 'fs';
import * as child_process from "child_process";
import * as util from "util";
const exec = util.promisify(child_process.exec);

// export pg pass 
// export PGPASSWORD=

const main =async () => {
    const testFolder = './out/';
    
    const files = fs.readdirSync(testFolder)

    for(const file of files)
    {
        console.log(`Loading ${file}`)
        const res = await exec(`PGPASSWORD= psql -h 34.79.53.136 -d movies-pg -U db-user -w -f ${testFolder+file}`)
        console.log(res.stderr)
        console.log(res.stdout)
    }
}
main();