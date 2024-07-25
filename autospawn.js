module.exports = {
    run: function() {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];

            // check is spawn is spawning
            if (spawn.spawning) {
                // find name of spawning creep
                let spawningCreep = Game.creeps[spawn.spawning.name];
                // display role 
                spawn.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns['Spawn1'].pos.x + 1, 
                    Game.spawns['Spawn1'].pos.y, 
                    {align: 'left', opacity: 0.8});
                continue; // move on spawn is busy
            }

            // count different roles
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            var constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (site) => site.structureType == STRUCTURE_EXTENSION
            });

            // Ensure 2 harvesters are spawned first
            if (harvesters.length < 2) {
                spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester' + Game.time, { memory: { role: 'harvester' } });
                continue; // Skip the rest of the loop for this spawn after spawning a harvester
            }

            // Spawn an upgrader after harvesters are sufficient
            if (upgraders.length < 1) {
                spawn.spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + Game.time, { memory: { role: 'upgrader' } });
                continue; // Skip the rest of the loop for this spawn after spawning an upgrader
            } 
            // if there is 1 upgrader and enough energy spawn bigUp
            else if (upgraders.length = 1) {
                const energyAvailable = spawn.room.energyAvailable;
                const energyCapacity = spawn.room.energyCapacityAvailable;

                if (energyAvailable >= 550) {
                    spawn.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'BigUpgrader' + Game.time, { memory: { role: 'upgrader' } });
                }
                continue;
            }

            // Spawn a builder after harvesters and upgrader are sufficient
            if (builders.length < 1) {
                spawn.spawnCreep([WORK, CARRY, MOVE], 'Builder' + Game.time, { memory: { role: 'builder' } });
            } else if (constructionSites.length > 0 && builders.length < 2) {
                // If there are extension construction sites and less than 2 builders, spawn an additional builder
                spawn.spawnCreep([WORK, CARRY, MOVE], 'Builder' + Game.time, { memory: { role: 'builder' } });
            }

        }
    }
};



