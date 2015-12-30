#!/bin/sh

# mongod --shardsvr --dbpath mongo --port 27021 &
# mongo --host localhost:27021
mongoimport --jsonArray --host localhost:27021 --db Dwarves_MMORPG --collection weapons --drop --file ./datasets/datasetWeapons.json
mongoimport --jsonArray --host localhost:27021 --db Dwarves_MMORPG --collection races --drop --file ./datasets/datasetRaces.json
mongoimport --jsonArray --host localhost:27021 --db Dwarves_MMORPG --collection teams --drop --file ./datasets/datasetTeams.json
mongoimport --jsonArray --host localhost:27021 --db Dwarves_MMORPG --collection users --drop --file ./datasets/datasetUsers.json
 
# db.users.createIndex({pseudo: 1})
# db.users.createIndex({characters.name: 1})
# db.users.createIndex({characters.position: 1})

# Find all characters on the position (10, 10)

// Find my user profile : 
var me = db.users.findOne({pseudo: "tchoubid0o"});

// 1) Find other characters around my character:
var myCharacter = me.characters[0];
var myPos = myCharacter.position;
db.users.aggregate([
	{$unwind: "$characters"}, 
	{$match: 
		{$and: 
			[
				{"characters.name": {$ne: myCharacter.name}},
				{"characters.position.x": {$gte: myPos.x-5}}, 
				{"characters.position.x": {$lte: myPos.x+5}}, 
				{"characters.position.y": {$gte: myPos.y-5}}, 
				{"characters.position.y":{$lte: myPos.y+5}}
			]
		}
	},
	{$project: {_id: 0, character: "$characters"}}
]);

// 2) Give the sorted list of the 3 characters having the best kill/death ratio.
db.users.aggregate([
	{$unwind: "$characters"}, 
	{$project: {_id: 0, name: "$characters.name", ratio: {$divide: ["$characters.kills", "$characters.deaths"]}}},
	{$sort: {ratio: -1}},
	{$limit: 3}
]);

// 3) Give the details of the team having the best average ratio.
var bestTeam = db.users.aggregate([
	{$unwind: "$characters"}, 
	{$match: {"characters.team": {$exists: 1}}},
	{$project: {_id: 0, name: "$characters.name", team: "$characters.team", ratio: {$divide: ["$characters.kills", "$characters.deaths"]}}},
	{$group: {_id: "$team", average_ratio: {$avg: "$ratio"}}},
	{$sort: {average_ratio: -1}},
	{$limit: 1}
]);

// We do an application-level join to get the details about the team :
db.teams.find({_id: bestTeam.result[0]._id});

// 4)
//TODO

// 5)
// TODO

// *** Other illustrations on the DB use : 

// Find all my characters:
var myCharacters = db.users.findOne({pseudo: "tchoubid0o"}, {_id: 0, characters: 1});

// Find other characters in my team:
db.teams.find({_id: myCharacter.team},{_id: 0, members: 1});