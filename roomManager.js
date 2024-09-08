const structureManager = require('structureManager');
const resourceManager = require('resourceManager');
const expansionManager = require('expansionManager'); // Import expansionManager

const roomManager = {
    run: function(room) {
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
