const resourceManager = {
    run: function(room) {
        // Manage containers and storage
        const containers = room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
        });
        
        const storage = room.storage;

        // Check energy status
        const energyAvailable = room.energyAvailable;
        const energyCapacity = room.energyCapacityAvailable;

        // Ensure we have enough harvesters to keep up with energy demand
        if (energyAvailable < energyCapacity * 0.3) {
            console.log(`${room.name}: Low energy, prioritize harvesters.`);
            // This would trigger the creepFactory to spawn more harvesters if needed
        }

        // Manage resource storage
        if (storage) {
            const storedEnergy = storage.store.getUsedCapacity(RESOURCE_ENERGY);
            if (storedEnergy > 50000) {
                console.log(`${room.name}: Energy reserves are high, consider upgrading or expanding.`);
            }
        }

        // Minerals and Extractor
        const mineral = room.find(FIND_MINERALS)[0];
        if (mineral) {
            // Optionally handle mining and storing minerals here
        }
    }
};

module.exports = resourceManager;
