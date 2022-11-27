import * as docker from "@pulumi/docker";
import * as gcp from "@pulumi/gcp";
import { Service } from "@pulumi/gcp/cloudrun";
import { ManagedZone } from "@pulumi/gcp/dns";
import * as pulumi from "@pulumi/pulumi";
import { IDockerSettings } from "./types";
import { getOutputValue, getSecretValue } from "./util";

export const deployContainer = async (config: IDockerSettings, dbConnectionString: string, zone: ManagedZone | undefined = undefined): Promise<Service> => {
    // Location to deploy Cloud Run services
    const location = gcp.config.zone ?? ""

    const githubClientId = "11c2d39160e19c5d2ab0"
    const jwtAccessSecret = await getSecretValue("JWT_ACCESS_SECRET")
    const jwtRefreshSecret =  await getSecretValue("JWT_REFRESH_SECRET")
    const githubOauthSecret =  await getSecretValue("GITHUB_OAUTH_SECRET")

    // Note: Run `gcloud auth configure-docker` in your command line to configure auth to GCR.
    const imageName = "express-app";
    const myImage = new docker.Image(imageName, {
        imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/${imageName}:v1.0.0`,
        build: {
            context: "../client",
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

    if(zone)
    {
        const dnsName = await getOutputValue(zone.dnsName)
    
        const defaultDomainMapping = new gcp.cloudrun.DomainMapping("default-domain-mapping", {
            location,
            name: dnsName.slice(0,dnsName.length-1),
            metadata: {
                namespace: gcp.config.project ?? "",
            },
            spec: {
                routeName: expressService.name,
            },
        });

        const rs = await getOutputValue(defaultDomainMapping.statuses[0].resourceRecords ?? pulumi.output([]))
        const rsValues = rs?.map(r => r.rrdata)

        new gcp.dns.RecordSet(`app-a-records`, {
            name: dnsName,
            managedZone: zone.name,
            type: 'A',
            ttl: 300,
            rrdatas: rsValues?.filter(r=>!r.includes("::"))
        }, {
            dependsOn: [zone, defaultDomainMapping],
            deleteBeforeReplace: true,
        });

        new gcp.dns.RecordSet(`app-aaaa-records`, {
            name: dnsName,
            managedZone: zone.name,
            type: 'AAAA',
            ttl: 300,
            rrdatas: rsValues?.filter(r=>r.includes("::")),
        }, {
            dependsOn: [zone, defaultDomainMapping],
            deleteBeforeReplace: true,
        });

        pulumi.log.info(`https://${dnsName}`)
    }
    

    // Open the service to public unrestricted access
    const iamEveryone = new gcp.cloudrun.IamMember("express-everyone", {
        service: expressService.name,
        location,
        role: "roles/run.invoker",
        member: "allUsers",
    });

    const containerStatuses = await getOutputValue(expressService.statuses)
    const url = containerStatuses[0].url
    pulumi.log.info(url)

    return expressService;
}