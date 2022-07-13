## Switch namespace
kubectl config set-context --current --namespace=food-app


## Connecting to Mongo Db running in K8s Cluster

# Root User conneciton string

mongodb://root:password123@localhost:27018/admin?authSource=admin&connectTimeoutMS=5000&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=false

# primary instance


# specify pod identity in namespace
kubectl port-forward mongodb-0 27018:27017

# Example
mongodb://localhost:27018/nextjs-ecomm?connectTimeoutMS=5000&w=majority&readPreference=primary&retryWrites=true&ssl=false


# Infinitum db
mongodb+srv://nx-infinitum:nx-infinitum@cluster0.6jvvv.mongodb.net/nextjs-ecomm?retryWrites=true&w=majority


# Port forward on the headless service
kubectl port-forward service/mongodb-headless 27018:27017 -n food-app

kubectl run -i --tty busybox --image=busybox:1.28 --restart=Never -- sh  

mongodb://foodie:secretPassword123@localhost:27018/nextjs-ecomm?authSource=nextjs-ecomm&connectTimeoutMS=5000&w=majority&readPreference=primary&retryWrites=true&ssl=false


mongodb://foodie:secretPassword123@mongodb-headless:27018/nextjs-ecomm?authSource=nextjs-ecomm&connectTimeoutMS=5000&w=majority&readPreference=primary&retryWrites=true&ssl=false


# Get Endpoints of mongodb-headless
kubectl get endpoints mongodb-headless

# DNS Record for endpoints
 - Spin up a pod in the cluster 
 - install mongo shell in that pod
 - use <pod-ip>.<headless-svc>.<namespace>.cluster.<cluster-name> as the name given to each Stateful set Pod DNS
