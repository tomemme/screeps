const structureManager = require('structureManager');
const resourceManager = require('resourceManager');
const expansionManager = require('expansionManager'); // Import expansionManager

const roomManager = {
    run: function(room) {
        // Initialize room tracking in Memory
        if (!Memory.rooms) {
            Memory.rooms = {};
        }

        if (!Memory.rooms[room.name]) {
            Memory.rooms[room.name] = { initializedAt: Game.time };
            console.log(`Room ${room.name} was initialized at tick ${Game.time}.`);
        }

        const ticksSinceRoomInitialized = Game.time - Memory.rooms[room.name].initializedAt;
        console.log(`Room ${room.name} has been active for ${ticksSinceRoomInitialized} ticks.`);
        
        // Manage resource collection (energy, minerals)
        resourceManager.run(room);

        // Manage room's structures, including building new ones
        structureManager.run(room);

        // road planning logic and repairing
        planRoads(room);
        planFixedRoads(room);

        // Manage links for energy transfer
        operateLinks(room);

        // Handle room expansion if eligible
        expansionManager.run(room);
        // Additional logic for defense and offense here
    }
};

// Plan roads where creeps frequently move
function planRoads(room) {
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];

        // Only build roads in this room
        if (creep.room.name !== room.name) continue;

        // Check if the creep is not on a road or construction site
        if (creep.room.lookForAt(LOOK_STRUCTURES, creep.pos).length === 0 &&
            creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.pos).length === 0) {

            // Track and increment positions that are frequently used
            let posKey = `${creep.pos.x}_${creep.pos.y}`;
            if (!room.memory.roadPlans) {
                room.memory.roadPlans = {};
            }
            if (!room.memory.roadPlans[posKey]) {
                room.memory.roadPlans[posKey] = 1;
            } else {
                room.memory.roadPlans[posKey]++;
            }

            // Build a road if a position is used 5 times or more
            if (room.memory.roadPlans[posKey] >= 10) {
                room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                console.log(`Building road at (${creep.pos.x}, ${creep.pos.y})`);
            }
        }
    }
}

function planFixedRoads(room) {
    let spawn = room.find(FIND_MY_SPAWNS)[0];
    if (spawn) {
        let path = spawn.pos.findPathTo(room.controller.pos, { ignoreCreeps: true });
        for (let step of path) {
            room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        }
        console.log('Planned road from spawn to controller');
    }
}

// Manage link energy transfer from sources to the controller/storage
function operateLinks(room) {
    let links = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_LINK }
    });

    let sourceLink, controllerLink;

    // Identify the links: One near the source and one near the controller
    for (let link of links) {
        if (link.pos.inRangeTo(room.controller, 4)) {
            controllerLink = link;
        } else if (link.pos.findInRange(FIND_SOURCES, 2).length > 0) {
            sourceLink = link;
        }
    }

    // Transfer energy if the source link has energy and a valid controller link exists
    if (sourceLink && controllerLink && sourceLink.store[RESOURCE_ENERGY] > 0) {
        sourceLink.transferEnergy(controllerLink);
        console.log('Transferred energy from source link to controller link');
    }
}

module.exports = roomManager;
