# Set var in terminal

# local k8s cluster mongo db
kubectl run -i --tty busybox --image=busybox:1.28 --restart=Never -- sh


mongodb-0.mongodb-headless.food-app.svc.cluster.local



MONGODB_URL="mongodb://foodie:secretPassword123@mongodb-0.mongodb-headless.food-app.svc.cluster.local:27017/nextjs-ecomm?authSource=nextjs-ecomm&directConnection=true&connectTimeoutMS=5000&w=majority&readPreference=primary&retryWrites=true&ssl=false"

# specify pod identity in namespace
kubectl port-forward mongodb-0 27018:27017


MONGODB_URL="mongodb://foodie:secretPassword123@host.docker.internal:27018/nextjs-ecomm?authSource=nextjs-ecomm&directConnection=true&connectTimeoutMS=5000&w=majority&readPreference=primary&retryWrites=true&ssl=false"

echo $MONGODB_URL

docker build \
-t nextjs/food-app:1.0.1 \
--network host \
--build-arg NEXT_PUBLIC_BASE_URL=http://localhost:30003 \
--build-arg MONGODB_URL=$MONGODB_URL \
--no-cache .


docker build \
-t nextjs/food-app:1.0.2 \
--network host \
--build-arg NEXT_PUBLIC_BASE_URL=http://localhost:3000 \
--build-arg MONGODB_URL=$MONGODB_URL \
--no-cache .



# nextjs/food-app:1.0.0 build using connecting to infinitum db
MONGODB_URL="mongodb+srv://nx-infinitum:nx-infinitum@cluster0.6jvvv.mongodb.net/nextjs-ecomm?retryWrites=true&w=majority"

echo $MONGODB_URL

docker build \
-t nextjs/food-app:1.0.0 \
--build-arg NEXT_PUBLIC_BASE_URL=http://localhost:30003 \
--build-arg MONGODB_URL=$MONGODB_URL \
--no-cache .

# port forward nextjs app

kubectl port-forward service/food-app-svc 30003:3003
