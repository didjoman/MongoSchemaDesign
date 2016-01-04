# Introduction
A node.js application has been created to test the different requests on the database. Refer to the section I.1 to set-up the database and to section I.2  and launch the app. If you don't have node.js installed, or if you don't want to use the application, refer to  the section I.3.

You can also have a look at the datasets, indexes and requests created (see section II, to see the directory organisation).

# I Test the database
## I.1 Database set-up
### I.1.a  Launch the MongoDB server on port 27021
```shell
    mongod --shardsvr --dbpath mongo --port 27021
```
### I.1.b Import datasets :
```shell
    ./import_datasets.sh
```
### I.1.c Create indexes:
```shell
    mongo --host localhost:27021 < indexes/indexes.js
```
## I.2 Test the requests (with the node.js application) :
The application has been created to test the different requests on the database.
To work, the application requires a mongoDB Server to be launched on the port 27021.

### I.2.a Install the dependencies :
```shell
    cd app
    npm install
```
### I.2.b Launch the app to get the result:
```shell
    node app.js
```
## I.3 Test the requests manually (without the app) :
### I.3.1 The Mongoshell
Launch the mongoshell :
```shell
    mongo --host localhost:27021
```
### I.3.2 Execute the requests on the database :
The requests executed on the database are stored in **requests/requests.js**.
These requests can be tested manually by copy-pasting it in the mongo shell.

# II Directories:

* **app/** 		: contains a node application to execute the requests on the database.
* **datasets/** 	: contains the datasets used to initialise the database.
* **mongo/** 		: directory used by mongoDB at launch time.
* **indexes/**	: contains the commands to add the indexes.
* **report/**		: contains the report explaining the design choices.
* **requests/**	: contains the requests executed by the application (ready to be executed directly in a shell)
