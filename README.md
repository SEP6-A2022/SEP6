# SEP6

## Getting started

1. Install google cloud cli

For mac:

```sh
brew install --cask google-cloud-sdk
```

For other platforms use <https://cloud.google.com/sdk/docs/install>

2. Copy the project id from the Google cloud dashboard and use it in the command below.

```sh
export G_PROJECT_ID=favorable-tree-366516
```

3. Init the CLI

```sh
gcloud init
```

Login to the account connected with your Google Cloud
Select the right project, if shown in list as nr. 1 select it, else press 2 and manually input the project id, the same as in step 2.

Select `europe-west1-b` (17) as the default region.

To trust githubactions go to https://cloud.google.com/iam/docs/creating-managing-service-accounts

1. Click on enable api.

2. Create the service account

```sh
gcloud iam service-accounts create github-federation --description="github actions service account" --display-name="github-oidc-provider"
```

3. Add project roles

```sh
gcloud projects add-iam-policy-binding favorable-tree-366516 --member="serviceAccount:github-federation@favorable-tree-366516.iam.gserviceaccount.com" --role="roles/actions.Admin"
```

```sh
gcloud projects add-iam-policy-binding favorable-tree-366516 --member="serviceAccount:github-federation@favorable-tree-366516.iam.gserviceaccount.com" --role="roles/cloudsql.admin"
```

4. Create identity pool.

```sh
gcloud iam workload-identity-pools create "github-pool" --project="favorable-tree-366516" --location="global" --display-name="Github pool"
```

5. Create identity provider
sh
```
gcloud iam workload-identity-pools providers create-oidc "github-provider" --project="favorable-tree-366516" --location="global" --workload-identity-pool="github-pool" --display-name="Github Provider" --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.aud=assertion.aud" --issuer-uri="https://token.actions.githubusercontent.com"
```

6. Allow impersonation

```sh
gcloud iam service-accounts add-iam-policy-binding "github-federation@favorable-tree-366516.iam.gserviceaccount.com" --project="favorable-tree-366516" --role="roles/iam.workloadIdentityUser" --member="principalSet://iam.googleapis.com/projects/31676311622/locations/global/workloadIdentityPools/github-pool/attribute.repository/SEP6-A2022/SEP6"
```