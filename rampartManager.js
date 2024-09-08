// rampartManager.js
const rampartManager = {
    run: function(room) {
        const criticalWalls = room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) &&
                structure.hits < 10000 // Set a threshold to prioritize repairs
        });

        // Loop through each wall/rampart and assign repair tasks
        criticalWalls.forEach(structure => {
            const repairers = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer' && creep.room.name === room.name);
            
            repairers.forEach((creep) => {
                if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            });
        });
    }
};

module.exports = rampartManager;
