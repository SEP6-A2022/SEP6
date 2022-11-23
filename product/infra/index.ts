import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { dbPassword, PulumiStackSettings } from "./src"
import { deployContainer } from "./src/docker";
import { getOutputValue, getSecretValue, getSecretValueFromOutput } from "./src/util";

let config = new pulumi.Config();
let clusterSettings = config.requireObject<PulumiStackSettings>("stack_settings");

const main =async () => {
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
    
    const dbSecret = await getSecretValueFromOutput(dbPassword.name)
    const ipAddress = await getOutputValue(instance.publicIpAddress)
    const connectionString =  `postgresql://db-user:${dbSecret}@${ipAddress}:5432/${dbName}?schema=public`

    const res = await deployContainer(clusterSettings.docker, connectionString)

    const containerStatuses = await getOutputValue(res.statuses)
    const url = containerStatuses[0].url

    pulumi.log.info(url)
}

main()