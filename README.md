
# To fulfill the database and test the requests :

##1) Launch the MongoDB server on port 27021

mongod --shardsvr --dbpath mongo --port 27021

##2) Load Data : 

./import_datasets.sh 

##3) Create indexes:
###a)	Launch a mongoDB shell :
	mongo --host localhost:27021
###b) Copy past the content of the file indexes/indexes.js in the mongoDB shell.

##4) Launch MongoDB requests :
###a) Change to the app directory
	cd app
###b) Install the dependencies :
	npm install
###c) Launch the app to get the result:
	node app.js

# To see the requests and execute it manually :
##1) Datasets
The datasets used to initialize the database are stored in datasets/

##2) Requests executed on the database :
The requests executed on the database are stored in requests/requests.js
These requests can be tested manually by copy-pasting the commands in a mongo shell.
To launch a mongo shell : 

	mongo --host localhost:27021 

# Directories:

* app/ 		: contains a node application to execute the requests on the database.
* datasets/ 	: contains the datasets used to initialise the database.
* mongo/ 		: directory used by mongoDB at launch time.
* indexes/	: contains the commands to add the indexes.
* report/		: contains the report explaining the design choices.
* requests/	: contains the requests executed by the application (ready to be executed directly in a shell)
