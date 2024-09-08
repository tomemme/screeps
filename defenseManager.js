// defenseManager.js
const towerManager = require('towerManager');
const rampartManager = require('rampartManager');
const creepFactory = require('creepFactory');

const defenseManager = {
    run: function(room) {
        // Safeguard: Check if the room exists and has a controller that belongs to you
        if (!room || !room.controller || !room.controller.my) {
            return;  // Skip this room if it's not yours or undefined
        }

        // Handle tower actions
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER
        });
        towers.forEach(tower => towerManager.run(tower));

        // Handle rampart and wall maintenance
        rampartManager.run(room);

        // Spawn defenders if necessary
        this.spawnDefenders(room);
    },

    spawnDefenders: function(room) {
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            const defenders = _.filter(Game.creeps, (creep) => creep.memory.role === 'defender' && creep.room.name === room.name);

            // Spawn 2 defenders if there are hostiles and less than 2 defenders
            if (defenders.length < 2) {
                creepFactory.createCreep(room, 'defender');
            }

            this.activateDefenders(room, hostiles);
        }
    },

    activateDefenders: function(room, hostiles) {
        const defenders = _.filter(Game.creeps, (creep) => creep.memory.role === 'defender' && creep.room.name === room.name);

        defenders.forEach(defender => {
            const closestHostile = defender.pos.findClosestByPath(hostiles);
            if (closestHostile) {
                if (defender.attack(closestHostile) === ERR_NOT_IN_RANGE) {
                    defender.moveTo(closestHostile, { visualizePathStyle: { stroke: '#ff0000' } });
                    defender.say('⚔️');  // Defender says it's attacking
                }
            }
        });
    }
};

module.exports = defenseManager;
