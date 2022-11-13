import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { Secret } from "@pulumi/gcp/secretmanager";

const defaultSettings = 
{
    labels: {
        deployment: "automatic",
    },
    replication: {
        userManaged: {
            replicas: [
                {
                    location: "europe-west1",
                }
            ],
        },
    }
}

export const dbPassword = new gcp.secretmanager.Secret("db-password", {
    ...defaultSettings,
    secretId: "dbpass",
});