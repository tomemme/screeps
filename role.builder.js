const roleBuilder = {
    run: function(creep) {
        // If the creep is out of energy, go gather energy
        if (creep.store[RESOURCE_ENERGY] === 0) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } 
        // If the creep has energy, try to build something
        else {
            const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } 
            // If there's nothing to build, switch to upgrading
            else {
                const controller = creep.room.controller;
                if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleBuilder;
