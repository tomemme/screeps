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

        // Handle room expansion if eligible
        expansionManager.run(room);
        // Additional logic for defense and offense here
    }
};

module.exports = roomManager;
