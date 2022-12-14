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

1. Click on enable API.

2. Create the service account

```sh
gcloud iam service-accounts create github-federation --description="github actions service account" --display-name="github-oidc-provider"
```

3. Add project roles

```sh
gcloud projects add-iam-policy-binding "$G_PROJECT_ID "--member="serviceAccount:github-federation@$G_PROJECT_ID.iam.gserviceaccount.com" --role="roles/owner"
```

4. Create the identity pool.

```sh
gcloud iam workload-identity-pools create "github-pool" --project="$G_PROJECT_ID" --location="global" --display-name="Github pool"
```

5. Create identity provider
sh
```
gcloud iam workload-identity-pools providers create-oidc "github-provider" --project="$G_PROJECT_ID" --location="global" --workload-identity-pool="github-pool" --display-name="Github Provider" --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" --issuer-uri="https://token.actions.githubusercontent.com"
```

6. Allow impersonation

```sh
gcloud iam service-accounts add-iam-policy-binding "github-federation@$G_PROJECT_ID.iam.gserviceaccount.com" --project="$G_PROJECT_ID" --role="roles/iam.workloadIdentityUser" --member="principalSet://iam.googleapis.com/projects/31676311622/locations/global/workloadIdentityPools/github-pool/attribute.repository/SEP6-A2022/SEP6"
```

8. Enable the API

```sh
gcloud services enable sqladmin.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable dns.googleapis.com
gcloud services enable storage.googleapis.com
```

9. Create a storage bucket

```sh
cloud storage buckets create gs://sep6-a2022
```

10. Login to the bucket

```sh
pulumi login gs://sep6-a2022
```

11. Register your Oauth App to GitHub.

Go to https://github.com/organizations/your-organization/settings/applications and click on add new app.
Input your domain-name, a name for the app then the domain-name/user/auth as the redirect URL.

12. Deploy the secrets.

dbpass - a random string to be used as database password, preferably minimum 16 characters
GITHUB_OAUTH_SECRET - the secret to the app above.
JWT_ACCESS_SECRET - a random string to be used as a secret for access JWT generation, preferably minimum 16 characters
JWT_REFRESH_SECRET - a random string to be used as refresh JWT generation, preferably minimum 16 characters
OMDB_API_KEY - get one at https://www.omdbapi.com/apikey.aspx

13. For local development/deployment

M1/M2 Macs only

```sh
env /usr/bin/arch -x86_64 /bin/zsh
export DOCKER_DEFAULT_PLATFORM=linux/amd64
```

```sh
export JWT_ACCESS_TOKEN_SECRET_STRING="abc"
export JWT_REFRESH_TOKEN_SECRET_STRING="abc2"
```
