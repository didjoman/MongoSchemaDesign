var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

// Connection URL
var url = 'mongodb://127.0.0.1:27021/Dwarves_MMORPG';

// Open the connection to the server
MongoClient.connect(url, function(err, db) {
    if(err) throw err;

    var users = db.collection('users');
    var races = db.collection('races');
    var teams = db.collection('teams');
    var weapons = db.collection('weapons');

    // Find my user profile : 
    users.findOne({pseudo: "tchoubid0o"}, function(err, me){
        if(err) throw err;

        console.log("My character's name is "+me.characters[0].name+
            ", his position is ("+me.characters[0].position.x+
            ","+ me.characters[0].position.y + ").\n");

        // 1) Find other characters around my character:
        var myCharacter = me.characters[0];
        var myPos = myCharacter.position;
        users.aggregate([
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
        ], function(err, others){
            if(err) throw err;

            console.log("\nThe characters around me are : \n");
            
            var len = others.length;
            for(var i=0; i < len ; ++i){
                var character = others[i];
                console.log(character.character);
                console.log("\n");
            }

        });
    });


    // 2) Give the sorted list of the 3 characters having the best kill/death ratio.
    users.aggregate([
        {$unwind: "$characters"}, 
        {$project: {_id: 0, name: "$characters.name", ratio: {$divide: ["$characters.kills", "$characters.deaths"]}}},
        {$sort: {ratio: -1}},
        {$limit: 3}
    ], function(err, characs){
        if(err) throw err;

        console.log("The 3 characters with the higgher kills/deaths ration are :\n");

        var len = characs.length;
        for(var i=0; i < len ; ++i){
            var charac = characs[i];
            console.log(charac);
        }
    });

    // 3) Give the details of the team having the best average ratio.
    users.aggregate([
        {$unwind: "$characters"}, 
        {$match: {"characters.team": {$exists: 1}}},
        {$project: {_id: 0, name: "$characters.name", team: "$characters.team", ratio: {$divide: ["$characters.kills", "$characters.deaths"]}}},
        {$group: {_id: "$team", average_ratio: {$avg: "$ratio"}}},
        {$sort: {average_ratio: -1}},
        {$limit: 1}
    ], function(err, bestTeam){
        if(err) throw err;
        console.log(""+bestTeam[0]._id);

        // We do an application-level join to get the details about the team :
        teams.findOne({_id: bestTeam[0]._id}, function(err, doc){
            if(err) throw err;

            console.log("\nThe team with the highest kills/deaths ratio is :\n");
            console.log(doc);
        });

    });


});
