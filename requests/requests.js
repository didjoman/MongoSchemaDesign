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

// 2) Find the best weapon a character has and can use
var characterName = 'Elfounet';
var character = db.users.aggregate([
    {$unwind: "$characters"}, 
    {$match: {"characters.name": characterName}},
    {$project: {_id: 0, character: "$characters"}}
]).result[0].character;

db.weapons.find({_id: {$in: character.weapons}, levelMin: {$lte: character.level}, races: character.race});


// 3) Give the sorted list of the 3 characters having the best kill/death ratio.
db.users.aggregate([
    {$unwind: "$characters"}, 
    {$project: {_id: 0, name: "$characters.name", ratio: {$divide: ["$characters.kills", "$characters.deaths"]}}},
    {$sort: {ratio: -1}},
    {$limit: 3}
]);

// 4) Give the details of the team having the best average ratio.
var bestTeam = db.users.aggregate([
    {$unwind: "$characters"}, 
    {$match: {"characters.team": {$exists: 1}}},
    {$project: {_id: 0, name: "$characters.name", team: "$characters.team", ratio: {$divide: ["$characters.kills", "$characters.deaths"]}}},
    {$group: {_id: "$team", average_ratio: {$avg: "$ratio"}}},
    {$sort: {average_ratio: -1}},
    {$limit: 1}
]);

// Then, We do an application-level join to get the details about the team :
db.teams.find({_id: bestTeam.result[0]._id});

// 5) Mose used race
db.users.aggregate([
    {$unwind: "$characters"},
    {$group: {_id: "$characters.raceName", count: {$sum: 1}}},
    {$sort: {count: -1}},
    {$limit: 1}
]).result[0]._id;


// *** Other illustrations on the DB use : 

// Find all my characters:
var myCharacters = db.users.findOne({pseudo: "tchoubid0o"}, {_id: 0, characters: 1});

// Find other characters in my team:
db.teams.find({_id: myCharacter.team},{_id: 0, members: 1});
