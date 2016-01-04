var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

// Connection URL
var url = 'mongodb://127.0.0.1:27021/Dwarves_MMORPG';


// 1) Find other characters around my character:
MongoClient.connect(url, function(err, db) {
    if(err) throw err;

    // Find my user profile : 

    db.collection('users').findOne({pseudo: 'tchoubid0o'}, function(err, me){
        if(err) throw err;
	
        console.log(' *** My character\'s name is '+me.characters[0].name+
                    ', his position is ('+me.characters[0].position.x+
                    ','+ me.characters[0].position.y + ').\n');

        // 1) Find other characters around my character:
        var myCharacter = me.characters[0];
        var myPos = myCharacter.position;
        db.collection('users').aggregate([
            {$unwind: '$characters'}, 
            {$match: 
             {$and: 
              [
                  {'characters.name': {$ne: myCharacter.name}},
                  {'characters.position.x': {$gte: myPos.x-5}}, 
                  {'characters.position.x': {$lte: myPos.x+5}}, 
                  {'characters.position.y': {$gte: myPos.y-5}}, 
                  {'characters.position.y':{$lte: myPos.y+5}}
              ]
             }
            },
            {$project: {_id: 0, character: '$characters'}}
        ], function(err, others){
            if(err || !others) throw err;

            console.log('\n *** The characters around me are : \n');
            
            var len = others.length;
            for(var i=0; i < len ; ++i){
                var character = others[i];
                console.log(character.character);
                console.log('\n');
                db.close();
            }
        });
    });
});

// 2) Find the best weapon a character has and can use
MongoClient.connect(url, function(err, db) {
    var characterName = 'Titan';
    var character = db.collection('users').aggregate([
        {$unwind: '$characters'}, 
        {$match: {'characters.name': characterName}},
        {$project: {_id: 0, character: '$characters'}}
    ], function(err, charac){
        if(err || !charac) throw err;
        
        var character = charac[0].character;
        db.collection('weapons').findOne({
            _id: {$in: character.weapons}, 
            levelMin: {$lte: character.level}, 
            races: character.race
        },function(err, weapon){
            if(err || !weapon) throw err;

            console.log(' *** The best (usable) weapon holded by a player is: \n');
            console.log(weapon);
            db.close();
        });
    });   
});

// 3) Give the sorted list of the 3 characters having the best kill/death ratio.
MongoClient.connect(url, function(err, db) {
    db.collection('users').aggregate([
        {$unwind: '$characters'}, 
        {$project: {_id: 0, name: '$characters.name', ratio: {$divide: ['$characters.kills', '$characters.deaths']}}},
        {$sort: {ratio: -1}},
        {$limit: 3}
    ], function(err, characs){
        if(err || !characs) throw err;

        console.log(' *** The 3 characters with the highest kills/deaths ration are :\n');

        var len = characs.length;
        for(var i=0; i < len ; ++i){
            var charac = characs[i];
            console.log(charac);
        }
        db.close();
    });
});

// 4) Give the details of the team having the best average ratio.
MongoClient.connect(url, function(err, db) {
    db.collection('users').aggregate([
        {$unwind: '$characters'}, 
        {$match: {'characters.team': {$exists: 1}}},
        {$project: {_id: 0, name: '$characters.name', team: '$characters.team', ratio: {$divide: ['$characters.kills', '$characters.deaths']}}},
        {$group: {_id: '$team', average_ratio: {$avg: '$ratio'}}},
        {$sort: {average_ratio: -1}},
        {$limit: 1}
    ], function(err, bestTeam){
        if(err || !bestTeam) throw err;

        // We do an application-level join to get the details about the team :
        db.collection('teams').findOne({_id: bestTeam[0]._id}, function(err, team){
            if(err || !team) throw err;

            console.log('\n *** The team with the highest kills/deaths ratio is :\n');
            console.log(team);
            db.close();
        });
    });
});

// 5) Get the most used race :
MongoClient.connect(url, function(err, db) {
    db.collection('users').aggregate([
	{$unwind: '$characters'},
	{$group: {_id: '$characters.raceName', count: {$sum: 1}}},
	{$sort: {count: -1}},
	{$limit: 1}
    ], function(err, race){
	if(err || !race) throw err;
	
	console.log('\n *** The most used race is : '+ race[0]._id + '\n');
        db.close();
    });
});


