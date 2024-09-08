const roleDefender = {
    run: function(creep) {
        const target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
            }
        } 
        // If no enemies are found, move to a patrol point or idle near the spawn
        else {
            const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
            creep.moveTo(spawn, { visualizePathStyle: { stroke: '#00ff00' } });
        }
    }
};

module.exports = roleDefender;
