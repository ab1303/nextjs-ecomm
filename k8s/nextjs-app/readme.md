# Set var in terminal


# troubleshoot pod
kubectl run -it --rm alpine --image=alpine:3.12 --restart=Never -- sh  
 apk --update add curl

kubectl run -it --rm busybox --image=busybox:1.28 --restart=Never -- sh


# local k8s cluster mongo db
kubectl run -it --rm busybox --image=busybox:1.28 --restart=Never -- sh

# go to the terminal of running mongodb-0 pod

hostname

hostname --fqdn

mongodb-0.mongodb-headless.food-app.svc.cluster.local

MONGODB_URL="mongodb://foodie:secretPassword123@mongodb-0.mongodb-headless.food-app.svc.cluster.local:27017/nextjs-ecomm?authSource=nextjs-ecomm&directConnection=true&connectTimeoutMS=5000&w=majority&readPreference=primary&retryWrites=true&ssl=false"

# Build docker image frontend

## Port Forword to mongodb
- kubectl port-forward mongodb-0 27018:27017

## make sure the endpoint is set to host.docker.internal for build containers to reach this endpoint
MONGODB_URL="mongodb://foodie:secretPassword123@host.docker.internal:27018/nextjs-ecomm?authSource=nextjs-ecomm&directConnection=true&connectTimeoutMS=5000&w=majority&readPreference=primary&retryWrites=true&ssl=false"

echo $MONGODB_URL

docker build \
-t nextjs/food-app:1.0.4 \
--network host \
--build-arg NEXT_PUBLIC_API_URL=https://food-app.a4bird.com \
--build-arg MONGODB_URL=$MONGODB_URL \
--no-cache .



# nextjs/food-app:1.0.5 build using connecting to infinitum db
MONGODB_URL="mongodb+srv://nx-infinitum:nx-infinitum@cluster0.6jvvv.mongodb.net/nextjs-ecomm?retryWrites=true&w=majority"

echo $MONGODB_URL

docker build \
-t nextjs/food-app:1.0.5 \
--build-arg NEXT_PUBLIC_API_URL=https://food-app.a4bird.com \
--build-arg MONGODB_URL=$MONGODB_URL \
--no-cache .

# AKS image
## nextjs/food-app-javelins:1.0.5 build using connecting to infinitum db
MONGODB_URL="mongodb+srv://nx-infinitum:nx-infinitum@cluster0.6jvvv.mongodb.net/nextjs-ecomm?retryWrites=true&w=majority"

echo $MONGODB_URL

docker build \
-t nextjs/food-app-javelins:1.0.5 \
--build-arg NEXT_PUBLIC_API_URL=https://food-app.javelins.online \
--build-arg MONGODB_URL=$MONGODB_URL \
--no-cache .


# port forward nextjs app

kubectl port-forward service/food-app-svc 30003:3003
