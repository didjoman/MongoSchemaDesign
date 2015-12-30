db.users.createIndex({ "pseudo" : 1});
db.users.createIndex({ "characters.name" : 1});
db.users.createIndex({ "team" : 1});
db.weapons.createIndex({ "name" : 1});
db.races.createIndex({ "name" : 1});
db.teams.createIndex({ "name" : 1});
