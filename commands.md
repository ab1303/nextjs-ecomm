#Steps
--------------- 

## Setup Environment variables in Shell

docker-compose -f docker-compose.yml up food-app

- with env-file command line
docker-compose -f docker-compose.yml --env-file .env.local.docker-compose up foodapp

- To rebuild this image you must use `docker-compose build` or `docker-compose up --build`

## Cloud Database URL

- MONGODB_URL=mongodb+srv://nx-infinitum:nx-infinitum@cluster0.6jvvv.mongodb.net/nextjs-ecomm?retryWrites=true&w=majority

- MONGODB_URL=mongodb://127.0.0.1:27017/nextjs-ecomm?retryWrites=true&w=majority&connectTimeoutMS=5000

## Debug 
# just build api
docker-compose -f docker-compose.yml -f docker-compose.override.yml up api --build -d