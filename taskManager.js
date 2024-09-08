const taskManager = {
    assignTask: function(creep) {
        const lifetime = Game.time - creep.memory.spawnedAt;
        console.log(`${creep.name} has been alive for ${lifetime} ticks.`); 
        
        switch(creep.memory.role) {
            case 'harvester':
                this.assignHarvesterTask(creep);
                break;
            case 'builder':
                this.assignBuilderTask(creep);
                break;
            case 'upgrader':
                this.assignUpgraderTask(creep);
                break;
            case 'repairer':
                this.assignRepairerTask(creep);
                break;
            case 'defender':
                // Defenders are handled in defenseManager
                break;
            default:
                console.log(`${creep.name} has no valid role.`);
        }
    },

    assignHarvesterTask: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00', opacity: 0.8 } });  // Yellow path for harvesting
                creep.say('⛏️');  // Creep says it's harvesting
            }
        } else {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                        structure.structureType === STRUCTURE_EXTENSION ||
                                        structure.structureType === STRUCTURE_TOWER) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8 } });  // White path for delivering energy
                    creep.say('⚡');  // Creep says it's delivering energy
                }
            } else {
                // if no energy demand, go upgrade
                this.assignUpgraderTask(creep);
            }
        }
    },

    assignBuilderTask: function(creep) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00', opacity: 0.8 } });  // Yellow path for harvesting
                creep.say('⛏️');  // Creep says it's harvesting for building
            }
        } else {
            const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8 } });  // White path for building
                    creep.say('🚧');  // Creep says it's building
                }
            } else {
                this.assignUpgraderTask(creep);  // Fallback to upgrading if no construction sites are available
            }
        }
    },

    assignUpgraderTask: function(creep) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00', opacity: 0.8 } });  // Yellow path for harvesting
                creep.say('⛏️');  // Creep says it's harvesting for upgrading
            }
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#00ff00', opacity: 0.8 } });  // Green path for upgrading
                creep.say('⚡');  // Creep says it's upgrading the controller
            }
        }
    },

    assignRepairerTask: function(creep) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00', opacity: 0.8 } });  // Yellow path for harvesting
                creep.say('⛏️');  // Creep says it's harvesting for repairs
            }
        } else {
            const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && 
                                        (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART)
            });
            if (target) {
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff9900', opacity: 0.8 } });  // Orange path for repairing
                    creep.say('🛠️');  // Creep says it's repairing
                }
            } else {
                this.assignUpgraderTask(creep);  // Fallback to upgrading if no repairs are needed
            }
        }
    }
};

module.exports = taskManager;
