const roleUpgrader = {
    run: function(creep) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } 
        // Upgrade the controller when energy is available
        else {
            const controller = creep.room.controller;
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};

module.exports = roleUpgrader;
