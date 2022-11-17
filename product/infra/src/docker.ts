import * as docker from "@pulumi/docker";
import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";
import { IDockerSettings } from "./types";

export const deployContainer = (config: IDockerSettings) => {
    // Location to deploy Cloud Run services
    const location = gcp.config.zone ?? ""
    
    // -------------------------------------- //
    // Deploy a custom container to Cloud Run //
    // -------------------------------------- //

    // Build a Docker image from our sample Ruby app and put it to Google Container Registry.
    // Note: Run `gcloud auth configure-docker` in your command line to configure auth to GCR.
    const imageName = "express-app";
    const myImage = new docker.Image(imageName, {
        imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/${imageName}:v1.0.0`,
        build: {
            context: "../client",
            // extraOptions: ["--platform linux/amd64"]
        },
    });

    // Deploy to Cloud Run. Some extra parameters like concurrency and memory are set for illustration purpose.
    const rubyService = new gcp.cloudrun.Service("express", {
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
    const iamRuby = new gcp.cloudrun.IamMember("express-everyone", {
        service: rubyService.name,
        location,
        role: "roles/run.invoker",
        member: "allUsers",
    });

    // Export the URL
    console.log(rubyService.statuses[0].url)
    return rubyService;
}