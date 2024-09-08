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
            default:
                console.log(`Invalid role requested: ${roleName}`);
                return;
        }

        const newName = `${roleName}_${Game.time}`;
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        
        if (spawn && !spawn.spawning) {
            const result = spawn.spawnCreep(bodyParts, newName, { memory: { role: roleName } });
            if (result === OK) {
                console.log(`${room.name}: Spawning new ${roleName} named ${newName}`);
            } else {
                console.log(`Failed to spawn ${roleName}: ${result}`);
            }
        }
    },

    getHarvesterBody: function(energyAvailable) {
        if (energyAvailable >= 550) return [WORK, WORK, WORK, CARRY, MOVE, MOVE];  // Larger harvesters
        return [WORK, CARRY, MOVE];  // Default smaller harvester
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
