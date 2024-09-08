// towerManager.js
const towerManager = {
    run: function(tower) {
        // Prioritize attacking enemies
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else {
            // If no hostiles, repair walls, ramparts, or roads
            const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) =>
                    (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART || structure.structureType === STRUCTURE_ROAD) &&
                    structure.hits < structure.hitsMax
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
};

module.exports = towerManager;
