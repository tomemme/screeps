const structureManager = {
    run: function(room) {
        // Check room controller level and plan structure construction accordingly
        const controllerLevel = room.controller.level;

        if (controllerLevel >= 2) {
            // Place extensions, max 5 at controller level 2
            this.planExtensions(room);
        }
        if (controllerLevel >= 3) {
            // Place towers and additional extensions
            this.planTowers(room);
        }
        if (controllerLevel >= 4) {
            // More structures like storage, links, etc.
            this.planStorage(room);
        }

        // Additional structure management
    },

    // Function to place extensions
    planExtensions: function(room) {
        const extensions = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_EXTENSION
        });

        const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];

        if (extensions.length < maxExtensions) {
            const constructionSites = room.find(FIND_CONSTRUCTION_SITES, {
                filter: (site) => site.structureType === STRUCTURE_EXTENSION
            });

            if (constructionSites.length === 0) {
                const position = this.findAvailablePositionForStructure(room, STRUCTURE_EXTENSION);
                if (position) {
                    room.createConstructionSite(position.x, position.y, STRUCTURE_EXTENSION);
                    console.log(`${room.name}: Placing extension at (${position.x}, ${position.y})`);
                }
            }
        }
    },

    // Function to place towers
    planTowers: function(room) {
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER
        });

        const maxTowers = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][room.controller.level];

        if (towers.length < maxTowers) {
            const constructionSites = room.find(FIND_CONSTRUCTION_SITES, {
                filter: (site) => site.structureType === STRUCTURE_TOWER
            });

            if (constructionSites.length === 0) {
                const position = this.findAvailablePositionForStructure(room, STRUCTURE_TOWER);
                if (position) {
                    room.createConstructionSite(position.x, position.y, STRUCTURE_TOWER);
                    console.log(`${room.name}: Placing tower at (${position.x}, ${position.y})`);
                }
            }
        }
    },

    // Function to place storage
    planStorage: function(room) {
        const storage = room.storage;

        if (!storage) {
            const constructionSites = room.find(FIND_CONSTRUCTION_SITES, {
                filter: (site) => site.structureType === STRUCTURE_STORAGE
            });

            if (constructionSites.length === 0) {
                const position = this.findAvailablePositionForStructure(room, STRUCTURE_STORAGE);
                if (position) {
                    room.createConstructionSite(position.x, position.y, STRUCTURE_STORAGE);
                    console.log(`${room.name}: Placing storage at (${position.x}, ${position.y})`);
                }
            }
        }
    },

    // Helper function to find available positions
    findAvailablePositionForStructure: function(room, structureType) {
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        if (!spawn) return null;

        // Simple position-finding logic around the spawn, expand based on need
        for (let xOffset = -5; xOffset <= 5; xOffset++) {
            for (let yOffset = -5; yOffset <= 5; yOffset++) {
                const x = spawn.pos.x + xOffset;
                const y = spawn.pos.y + yOffset;
                const position = new RoomPosition(x, y, room.name);
                const isBuildable = position.lookFor(LOOK_TERRAIN).every((t) => t !== 'wall');

                if (isBuildable && room.createConstructionSite(x, y, structureType) === OK) {
                    return { x, y };
                }
            }
        }
        return null;
    }
};

module.exports = structureManager;
