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
gcloud projects add-iam-policy-binding favorable-tree-366516 --member="serviceAccount:github-federation@favorable-tree-366516.iam.gserviceaccount.com" --role="roles/owner"
```

4. Create identity pool.

```sh
gcloud iam workload-identity-pools create "github-pool" --project="favorable-tree-366516" --location="global" --display-name="Github pool"
```

5. Create identity provider
sh
```
gcloud iam workload-identity-pools providers create-oidc "github-provider" --project="favorable-tree-366516" --location="global" --workload-identity-pool="github-pool" --display-name="Github Provider" --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" --issuer-uri="https://token.actions.githubusercontent.com"
```

6. Allow impersonation

```sh
gcloud iam service-accounts add-iam-policy-binding "github-federation@favorable-tree-366516.iam.gserviceaccount.com" --project="favorable-tree-366516" --role="roles/iam.workloadIdentityUser" --member="principalSet://iam.googleapis.com/projects/31676311622/locations/global/workloadIdentityPools/github-pool/attribute.repository/SEP6-A2022/SEP6"
```

7. export GOOGLE_PROJECT=favorable-tree-366516

8. cloud storage buckets create gs://sep6-a2022

9. pulumi login gs://sep6-a2022

10. Deploy secrets.

11. Enable api

```sh
gcloud services enable sqladmin.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable dns.googleapis.com
```

12. Create  bucket
AND ADD THE FILE TO THE BUCKET.

13. Dump the db.

```sql
DELETE FROM stars WHERE person_id NOT IN (SELECT id FROM people);
DELETE FROM stars WHERE movie_id NOT IN (SELECT id FROM movies);
DELETE FROM directors WHERE person_id NOT IN (SELECT id FROM people);
DELETE FROM directors WHERE movie_id NOT IN (SELECT id FROM movies);
DELETE FROM ratings WHERE movie_id NOT IN (SELECT id FROM movies);
```

```sh
sqlite3 movies.db .dump | sed -e 's/INTEGER PRIMARY KEY AUTOINCREMENT/SERIAL PRIMARY KEY/g;s/PRAGMA foreign_keys=OFF;//;s/unsigned big int/BIGINT/g;s/UNSIGNED BIG INT/BIGINT/g;s/BIG INT/BIGINT/g;s/UNSIGNED INT(10)/BIGINT/g;s/BOOLEAN/SMALLINT/g;s/boolean/SMALLINT/g;s/UNSIGNED BIG INT/INTEGER/g;s/INT(3)/INT2/g;s/DATETIME/TIMESTAMP/g;s/TINYINT(1)/SMALLINT/g' > movies-pg.sql
```

14. Upload SQL file there
15. Import to DB.

```sh
psql -h 34.79.53.136 -d movies-pg -U postgres -W -f movies-pg.sql
```

or in the UI import and select the DB and file.

<https://www.prisma.io/docs/concepts/components/introspection#the-prisma-introspect-command>

16. For local development/deployment

```sh
export DOCKER_DEFAULT_PLATFORM=linux/amd64
export JWT_ACCESS_TOKEN_SECRET_STRING="abc"
export JWT_REFRESH_TOKEN_SECRET_STRING="abc2"
```

if running manually on a MAC with M1