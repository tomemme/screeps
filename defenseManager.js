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

        // add wall and rampart building
        buildWalls(room);
        protectCoreStructures(room);

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

// Build walls around the edges of the room
function buildWalls(room) {
    const terrain = room.getTerrain();
    const edges = [];
    
    // Get all room edges for wall construction
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            if (x === 0 || x === 49 || y === 0 || y === 49) {
                if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                    edges.push(new RoomPosition(x, y, room.name));
                }
            }
        }
    }

    // Place walls along the room edges
    for (let edge of edges) {
        if (room.lookForAt(LOOK_STRUCTURES, edge).length === 0) {
            room.createConstructionSite(edge, STRUCTURE_WALL);
        }
    }
    console.log('Walls planned around the room');
}

// Protect key structures with ramparts
function protectCoreStructures(room) {
    let importantStructures = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_SPAWN ||
                               structure.structureType === STRUCTURE_STORAGE ||
                               structure.structureType === STRUCTURE_TOWER ||
                               structure.structureType === STRUCTURE_CONTROLLER
    });

    // Build ramparts around core structures
    for (let structure of importantStructures) {
        room.createConstructionSite(structure.pos, STRUCTURE_RAMPART);
        console.log(`Protecting ${structure.structureType} with rampart`);
    }
}

module.exports = defenseManager;
