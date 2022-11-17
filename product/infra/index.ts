import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { Secret } from "@pulumi/gcp/secretmanager";
import {dbPassword, IK8Settings, PulumiStackSettings} from "./src"
import { userInfo } from "os";
import { getCluster } from "./src";

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

    const cluster = getCluster(clusterSettings.k8s)
}

main()