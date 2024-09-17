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
            case 'runner':
                this.assignRunnerTask(creep);
                break;
            case 'defender':
                // Defenders are handled in defenseManager
                break;
            default:
                console.log(`${creep.name} has no valid role.`);
        }
    },

    // Add this to taskManager.js for the runner's logic
    assignRunnerTask: function(creep) {
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
            // Tower refueling logic: Allow only one creep to refuel the tower
            let tower = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => structure.structureType === STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            })[0];

            // Check if the tower is being serviced by another creep
            if (tower && (!Memory.towerServicedBy || Memory.towerServicedBy === creep.id)) {
                // Mark the tower as being serviced by this creep
                Memory.towerServicedBy = creep.id;

                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, { visualizePathStyle: { stroke: '#ffffff' } });
                    creep.say('🚛 Refueling Tower');
                } else {
                    // After refueling, clear the flag so another creep can refuel it next time
                    delete Memory.towerServicedBy;
                }

                return;  // Stop further actions, as this creep is focused on refueling the tower
            }

            // Proceed with normal behavior (e.g., delivering to extensions, builders, upgraders)
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION ||
                                        structure.structureType === STRUCTURE_SPAWN) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
    
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    creep.say('🚛');
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
                        builder.memory.servicedBy = creep.id; // Mark the builder as being serviced by this runner
                        if (creep.transfer(builder, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(builder, { visualizePathStyle: { stroke: '#ffffff' } });
                            creep.say('🚛🚧');
                        }else {
                            // After successfully transferring, clear the flag
                            delete builder.memory.servicedBy;
                        }
                    }
                } else {
                    // If no construction, deliver energy to upgraders
                    let upgrader = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                        filter: (otherCreep) => otherCreep.memory.role === 'upgrader' &&
                            otherCreep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                            !otherCreep.memory.servicedBy  // Ensure the upgrader isn't already being serviced
                    });
    
                    if (upgrader) {
                        // Mark the upgrader as being serviced by this runner
                        upgrader.memory.servicedBy = creep.id;
                        if (creep.transfer(upgrader, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(upgrader, { visualizePathStyle: { stroke: '#ffffff' } });
                            creep.say('🚛⚡');
                        } else {
                            // After successfully transferring, clear the flag
                            delete upgrader.memory.servicedBy;
                        }
                    }
                }
            }
        }
    }, 

    assignHarvesterTask: function(creep) {
        // If the harvester hasn't been assigned a source, assign it
        if (!creep.memory.assignedSource) {
            let sources = creep.room.find(FIND_SOURCES);
    
            // Distribute the harvesters across the sources
            let harvestersAssignedToSource1 = _.filter(Game.creeps, (c) => c.memory.role === 'harvester' && c.memory.assignedSource === sources[0].id).length;
            let harvestersAssignedToSource2 = _.filter(Game.creeps, (c) => c.memory.role === 'harvester' && c.memory.assignedSource === sources[1].id).length;
    
            // Assign harvesters based on current distribution
            if (harvestersAssignedToSource1 < 2) {
                creep.memory.assignedSource = sources[0].id;  // Assign to first source
            } else {
                creep.memory.assignedSource = sources[1].id;  // Assign to second source
            }
        }
    
        // Find the source assigned to this harvester
        let source = Game.getObjectById(creep.memory.assignedSource);
    
        // If the harvester has capacity left, continue harvesting
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                creep.say('⛏️');
            }
        } else {
            // If the harvester is full, drop the energy on the ground
            creep.say('⚡');
            creep.drop(RESOURCE_ENERGY);
        }
    },
    
    assignBuilderTask: function(creep) {
        // If the builder has energy, build the nearest construction site
        if (creep.store[RESOURCE_ENERGY] > 0) {
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff', opacity: 0.8 } });  // White path for building
                    creep.say('🚧 Building');
                }
            } else {
                // No construction site, look for other tasks (like repairing)
                // Or let the builder wait
                creep.say('🔄 Waiting');
            }
        } else {
            // If out of energy or no construction sites, look for dropped energy nearby
            let droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: (resource) => resource.resourceType === RESOURCE_ENERGY && resource.amount > 50 // Only pick up energy if it is significant
            });
    
            if (droppedEnergy) {
                if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: '#ffaa00', opacity: 0.8 } });  // Yellow path for collecting energy
                    creep.say('🔄 Collecting Energy');
                }
            } else {
                // If no dropped energy found, wait near the construction site or controller
                let target = creep.pos.findClosestByRange([creep.room.controller, creep.pos.findClosestByPath(FIND_MY_STRUCTURES)]);
                if (target) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00', opacity: 0.5 } });
                    creep.say('🔄 Waiting');
                }
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
