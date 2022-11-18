import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import {dbPassword, PulumiStackSettings} from "./src"
import { deployContainer } from "./src/docker";

let config = new pulumi.Config();
let clusterSettings = config.requireObject<PulumiStackSettings>("stack_settings");

const main =async () => {
    const basic = gcp.secretmanager.getSecretVersionOutput({
        secret: dbPassword.name
    });

    const instance = new gcp.sql.DatabaseInstance("instance", {
        region: "europe-west1",
        databaseVersion: "POSTGRES_14",
        settings: {
            tier: "db-f1-micro",
        },
        deletionProtection: false,
    });

    const dbName = "movies-pg"
    // don't forget to load data here.
    const database = new gcp.sql.Database("postgres", {instance: instance.name, name: dbName});

    instance.publicIpAddress.apply(ip=> {
        basic.secretData.apply(pass=> {
            const dbConnectionString = `postgresql://db-user:${pass}@${ip}:5432/${dbName}?schema=public`
            pulumi.log.info(dbConnectionString)
            const res = deployContainer(clusterSettings.docker, dbConnectionString)
            res.statuses.apply(v => pulumi.log.info(v[0].url))
        })
    })
}

main()