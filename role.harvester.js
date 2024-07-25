// Define the roleHarvester module
var roleHarvester = {

    /**
     * Main function to run the harvester logic.
     * @param {Creep} creep - The creep object to run this logic on.
     */
    run: function(creep) {
        // Check if the creep can carry more energy
        if(creep.store.getFreeCapacity() > 0) {
            // Find all sources of energy in the room
            var sources = creep.room.find(FIND_SOURCES);
            // Try to harvest from the first source in the list
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                // If not in range, move towards the source
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        // If the creep's store is full (no free capacity)
        else {
            // Find all structures that can store energy (extensions, spawn, tower)
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            // If there are any structures that need energy
            if(targets.length > 0) {
                // Try to transfer energy to the first structure in the list
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // If not in range, move towards the structure
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // If no structures need energy, standby near a structure that can store energy
            else {
                // Find a standby target near the spawn or other structure
                var standbyTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_TOWER);
                    }
                });

                // check for construction sites and build if available
                var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(constructionSites.length > 0) {
                    if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSites[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
                // if no construction sites, standby target.
                else if(standbyTarget) {
                    creep.moveTo(standbyTarget, {visualizePathStyle: {stroke: '#ffaa00'}})
                }
            }
        }
    }
};

module.exports = roleHarvester;