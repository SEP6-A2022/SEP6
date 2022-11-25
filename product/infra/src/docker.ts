import * as docker from "@pulumi/docker";
import * as gcp from "@pulumi/gcp";
import { Service } from "@pulumi/gcp/cloudrun";
import * as pulumi from "@pulumi/pulumi";
import { IDockerSettings } from "./types";
import { getSecretValue } from "./util";

export const deployContainer = async (config: IDockerSettings, dbConnectionString: string): Promise<Service> => {
    // Location to deploy Cloud Run services
    const location = gcp.config.zone ?? ""

    const githubClientId = "11c2d39160e19c5d2ab0"
    const jwtAccessSecret = await getSecretValue("JWT_ACCESS_SECRET")
    const jwtRefreshSecret =  await getSecretValue("JWT_REFRESH_SECRET")
    const githubOauthSecret =  await getSecretValue("GITHUB_OAUTH_SECRET")

    // Build a Docker image from our sample Express app and put it to Google Container Registry.
    // Note: Run `gcloud auth configure-docker` in your command line to configure auth to GCR.
    process.env.DATABASE_URL = dbConnectionString
    const imageName = "express-app";
    const myImage = new docker.Image(imageName, {
        imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/${imageName}:v1.0.0`,
        build: {
            context: "../client",
            env: {
                "DATABASE_URL" : dbConnectionString
            }
        },
    });

    // Deploy to Cloud Run. Some extra parameters like concurrency and memory are set for illustration purpose.
    const expressService = new gcp.cloudrun.Service("express", {
        location,
        template: {
            spec: {
                containers: [{
                    image: myImage.imageName,
                    resources: {
                        limits: {
                            memory: "1Gi",
                        },
                    },
                    ports:[
                        {
                            containerPort: 3000
                        }
                    ],
                    envs: [
                        {
                            name: "DATABASE_URL",
                            value: dbConnectionString
                        },
                        {
                            name: "GITHUB_CLIENT_ID",
                            value: githubClientId
                        },
                        {
                            name: "GITHUB_OAUTH_SECRET",
                            value: githubOauthSecret
                        },
                        {
                            name: "JWT_ACCESS_TOKEN_SECRET_STRING",
                            value: jwtAccessSecret
                        },
                        {
                            name: "JWT_REFRESH_TOKEN_SECRET_STRING",
                            value: jwtRefreshSecret
                        },
                        {
                            name: "time",
                            value: new Date().getSeconds()+""
                        }
                    ]
                }],
                containerConcurrency: 2,
            },
        },
    });

    // Open the service to public unrestricted access
    const iamEveryone = new gcp.cloudrun.IamMember("express-everyone", {
        service: expressService.name,
        location,
        role: "roles/run.invoker",
        member: "allUsers",
    });

    return expressService;
}