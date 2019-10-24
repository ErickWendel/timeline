#!/bin/bash

AZURE_STORAGE_ACCOUNT='ewtimeline'
RESOURCE_GROUP='erickwendel'
container_name='timeline-erickwendel'
source_folder='../'

AZURE_STORAGE_ACCESS_KEY=$(az storage account keys list \
  --account-name $AZURE_STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --output json \
  --query "[0].value")
export AZURE_STORAGE_ACCESS_KEY
export AZURE_STORAGE_ACCOUNT

# az storage container create \
#   --name $container_name \
#   --account-name $AZURE_STORAGE_ACCOUNT

# az storage blob delete-batch --pattern 2019-06-29-10_secrets_to_improve_javascript_performance -s timeline-erickwendel

for f in $(ls $source_folder | grep 2019-10-23-10); do

  echo "Uploading $(basename $f) file..."
  az storage blob upload-batch -d $container_name \
    --account-name $AZURE_STORAGE_ACCOUNT -s $source_folder/$f \
    --destination-path $(basename $f) \
    --if-modified-since '2019-5-23'T'17:03'Z''
done

echo "Completed"

#------------------------------------
# FILE_BLOB=videos-tela/videos-tela-11-30.mp4
# echo "Downloading... $FILE_BLOB"
# az storage blob download --container-name $container_name \
#   --file $(basename $FILE_BLOB) \
#   --name $FILE_BLOB \
#   --account-name $AZURE_STORAGE_ACCOUNT
