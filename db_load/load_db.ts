import fs from 'fs';
import * as child_process from "child_process";
import * as util from "util";
const exec = util.promisify(child_process.exec);

const PG_PASSWORD="password deployed to secrets manager"
const DB_IP="the ip of the database, can be seen on google cloud"

const main =async () => {
    const testFolder = './out/';
    
    const files = fs.readdirSync(testFolder)

    for(const file of files)
    {
        console.log(`Loading ${file}`)
        const res = await exec(`PGPASSWORD=${PG_PASSWORD} psql -h ${DB_IP} -d movies-pg -U db-user -w -f ${testFolder+file}`)
        console.log(res.stderr)
        console.log(res.stdout)
    }
}
main();