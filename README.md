# SEP6

## Getting started

1. Install google cloud cli

```sh
brew install --cask google-cloud-sdk
```

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

