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

    const database = new gcp.sql.Database("postgres", {instance: instance.name, name: "movies-pg"});

    const res = deployContainer(clusterSettings.docker)
}

main()