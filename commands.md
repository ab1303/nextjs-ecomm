#Steps
--------------- 

## Setup Environment variables in Shell

docker-compose -f docker-compose.yml up food-app

- with env-file command line
docker-compose -f docker-compose.yml --env-file .env.local.docker-compose up foodapp

- To rebuild this image you must use `docker-compose build` or `docker-compose up --build`

## Debug 
# just build api
docker-compose -f docker-compose.yml -f docker-compose.override.yml up api --build -d