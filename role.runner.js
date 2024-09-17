var roleRunner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Check if runner needs to collect energy
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            // Look for dropped energy first
            let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (resource) => resource.resourceType === RESOURCE_ENERGY
            });

            // If dropped energy is found, pick it up
            if (target) {
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                    creep.say('🚛 Collecting');
                }
            } else {
                // If no dropped energy, look for energy in containers
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                        structure.store[RESOURCE_ENERGY] > 0
                });

                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
                        creep.say('🚛 Withdrawing');
                    }
                }
            }
        } 
        else {
            // Runner is full, prioritize delivering energy to structures (extensions, spawns, towers)
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION ||
                                        structure.structureType === STRUCTURE_SPAWN ||
                                        structure.structureType === STRUCTURE_TOWER) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    creep.say('🚛 Delivering');
                }
            } else {
                // Deliver to builders if construction sites exist and builders need energy
                let constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (constructionSite.length > 0) {
                    let builder = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                        filter: (otherCreep) => otherCreep.memory.role === 'builder' &&
                            otherCreep.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    });

                    if (builder) {
                        if (creep.transfer(builder, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(builder, { visualizePathStyle: { stroke: '#ffffff' } });
                            creep.say('🚛 Supplying Builder');
                        }
                    }
                } else {
                    // If no construction, deliver energy to upgraders
                    let upgrader = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                        filter: (otherCreep) => otherCreep.memory.role === 'upgrader' &&
                            otherCreep.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    });

                    if (upgrader) {
                        if (creep.transfer(upgrader, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(upgrader, { visualizePathStyle: { stroke: '#ffffff' } });
                            creep.say('🚛 Supplying Upgrader');
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleRunner;
