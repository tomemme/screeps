// creepFactory.js
const creepFactory = {
    createCreep: function(room, roleName) {
        const energyAvailable = room.energyAvailable;
        let bodyParts;

        // Define body parts based on role and available energy
        switch(roleName) {
            case 'harvester':
                bodyParts = this.getHarvesterBody(energyAvailable);
                break;
            case 'builder':
                bodyParts = this.getBuilderBody(energyAvailable);
                break;
            case 'upgrader':
                bodyParts = this.getUpgraderBody(energyAvailable);
                break;
            case 'repairer':
                bodyParts = this.getRepairerBody(energyAvailable);
                break;
            case 'defender':
                bodyParts = this.getDefenderBody(energyAvailable);
                break;
            case 'runner':
                bodyParts = this.getRunnerBody(energyAvailable);
                break;
            default:
                console.log(`Invalid role requested: ${roleName}`);
                return;
        }

        const newName = `${roleName}_${Game.time}`;
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        
        if (spawn && !spawn.spawning) {
            let memory = { role: roleName, spawnedAt: Game.time };

             // If the role is 'runner', add the toggle flag for alternating between builder and upgrader
            if (roleName === 'runner') {
                memory.deliverToUpgrader = false;  // Start with builder delivery first
            } 

            const result = spawn.spawnCreep(bodyParts, newName, { memory });
            if (result === OK) {
                console.log(`${room.name}: Spawning new ${roleName} named ${newName}`);
            } else {
                console.log(`Failed to spawn ${roleName}: ${result}`);
            }
        }
    },

    // Add a helper function to decide if a runner is needed
    shouldSpawnRunner: function(room) {
        const runners = _.filter(Game.creeps, (creep) => creep.memory.role === 'runner' && creep.room.name === room.name);
        const droppedEnergy = room.find(FIND_DROPPED_RESOURCES);
    
    // You can adjust the conditions based on your energy flow needs
    return (runners.length < 2 && droppedEnergy.length > 0);
    },

    getHarvesterBody: function(energyAvailable) {
        if (energyAvailable >= 550) return [WORK, WORK, WORK, CARRY, MOVE, MOVE];  // Larger harvesters
        return [WORK, CARRY, MOVE];  // Default smaller harvester
    },

    getRunnerBody: function(energyAvailable) {
        if (energyAvailable >= 550) return [ MOVE, CARRY, CARRY, MOVE, MOVE];  // Larger harvesters
        return [MOVE, CARRY, MOVE];  // Default smaller harvester
    },

    getBuilderBody: function(energyAvailable) {
        if (energyAvailable >= 550) return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        return [WORK, CARRY, MOVE];  // Default smaller builder
    },

    getUpgraderBody: function(energyAvailable) {
        if (energyAvailable >= 550) return [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
        return [WORK, CARRY, MOVE];  // Default smaller upgrader
    },

    getRepairerBody: function(energyAvailable) {
        if (energyAvailable >= 550) return [WORK, WORK, CARRY, MOVE, MOVE];
        return [WORK, CARRY, MOVE];  // Default smaller repairer
    },

    getDefenderBody: function(energyAvailable) {
        if (energyAvailable >= 600) return [TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE];
        return [TOUGH, ATTACK, MOVE];  // Default smaller defender
    }
};

module.exports = creepFactory;
