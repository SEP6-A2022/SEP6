export interface PulumiStackSettings {
    docker: IDockerSettings
}
export interface IDockerSettings {
    instance_type: string
    dns_name: string
}