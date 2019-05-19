#!/bin/bash

AZURE_STORAGE_ACCOUNT='ewtimeline'
container_name='timeline-erickwendel'
source_folder='../'

for f in $(ls $source_folder | grep 20); do

  echo "Uploading $(basename $f) file..."
  az storage blob upload-batch -d $container_name \
    --account-name $AZURE_STORAGE_ACCOUNT -s $source_folder/$f \
    --destination-path $(basename $f)
done

echo "Completed"

#------------------------------------
# FILE_BLOB=videos-tela/videos-tela-11-30.mp4
# echo "Downloading... $FILE_BLOB"
# az storage blob download --container-name $container_name \
#   --file $(basename $FILE_BLOB) \
#   --name $FILE_BLOB \
#   --account-name $AZURE_STORAGE_ACCOUNT
