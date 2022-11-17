import * as docker from "@pulumi/docker";
import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import { IDockerSettings } from "./types";

export const deployContainer = (config: IDockerSettings) => {
    // Location to deploy Cloud Run services
    const location = gcp.config.zone ?? ""

    // Build a Docker image from our sample Express app and put it to Google Container Registry.
    // Note: Run `gcloud auth configure-docker` in your command line to configure auth to GCR.
    const imageName = "express-app";
    const myImage = new docker.Image(imageName, {
        imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/${imageName}:v1.0.0`,
        build: {
            context: "../client"
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

    // Export the URL
    return expressService;
}