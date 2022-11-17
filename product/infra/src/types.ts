export interface PulumiStackSettings {
    k8s: IK8Settings
}
export interface IK8Settings {
    instance_type: string
}