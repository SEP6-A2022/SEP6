import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { getOutputValue } from "./util";

export const createDnsZone =async (zoneName: string) => {
    const hostedZone = new gcp.dns.ManagedZone("hosted-zone", {
        description: `Hosted zone for ${zoneName}.`,
        name: "sep6zone",
        dnsName: `${zoneName}.`,
        labels: {
            deployment: "pulumi",
        },
        dnssecConfig: {
            state: "on"
        }
    });

    console.log(await getOutputValue(hostedZone.nameServers))
    return hostedZone
}