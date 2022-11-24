import {Output} from "@pulumi/pulumi"
import * as gcp from "@pulumi/gcp";

export const getOutputValue = <T>(output: Output<T>): Promise<T> => {
    return new Promise<T>((resolve, reject)=>{
        output.apply(value=>{
            resolve(value);
        });
    });
}

export const getSecretValue =async (secretName: string): Promise<string> => {
    const secret = gcp.secretmanager.getSecretVersionOutput({
        secret: secretName
    });
    return await getOutputValue(secret.secretData)
}

export const getSecretValueFromOutput =async (secretName: Output<string>): Promise<string> => {
    const name = await getOutputValue(secretName)
    const secret = gcp.secretmanager.getSecretVersionOutput({
        secret: name
    });
    return await getOutputValue(secret.secretData)
}