echo "building image"
cp ./credentials/test_env/settings.env .env

/usr/local/bin/docker-compose pull
/usr/local/bin/docker-compose down --volumes
/usr/local/bin/docker-compose run --entrypoint /dev-ui/build.sh requisition-batch-ui
/usr/local/bin/docker-compose build image
/usr/local/bin/docker-compose down --volumes

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"

echo "pushing image for dev/test instance"
docker tag openlmismz/requisition-batch-ui:latest openlmismz/requisition-batch-ui:${version}
docker push openlmismz/requisition-batch-ui:${version}

rm -Rf ./credentials
rm -f .env