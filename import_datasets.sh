#!/bin/sh

mongoimport --jsonArray --host localhost:27021 --db Dwarves_MMORPG --collection weapons --drop --file ./datasets/datasetWeapons.json
mongoimport --jsonArray --host localhost:27021 --db Dwarves_MMORPG --collection races --drop --file ./datasets/datasetRaces.json
mongoimport --jsonArray --host localhost:27021 --db Dwarves_MMORPG --collection teams --drop --file ./datasets/datasetTeams.json
mongoimport --jsonArray --host localhost:27021 --db Dwarves_MMORPG --collection users --drop --file ./datasets/datasetUsers.json
