const expansionManager = {
    run: function(room) {
        const controllerLevel = room.controller.level;

        // Look for neutral rooms nearby when controller is level 4+
        if (controllerLevel >= 4 && !room.memory.isExpanding) {
            const nearbyRooms = Game.map.describeExits(room.name);

            for (let exit in nearbyRooms) {
                const roomName = nearbyRooms[exit];
                const targetRoom = Game.rooms[roomName];
                
                if (targetRoom && !targetRoom.controller.my && targetRoom.controller) {
                    if (!targetRoom.controller.owner && !targetRoom.controller.reservation) {
                        this.planExpansion(room, roomName);
                        break;
                    }
                }
            }
        }
    },

    // Plan expansion to a target room
    planExpansion: function(room, targetRoomName) {
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        
        if (spawn && !spawn.spawning) {
            const claimerName = 'Claimer' + Game.time;
            const result = spawn.spawnCreep([CLAIM, MOVE], claimerName, {
                memory: { role: 'claimer', targetRoom: targetRoomName }
            });
            
            if (result === OK) {
                room.memory.isExpanding = true;
                console.log(`${room.name}: Expanding to room ${targetRoomName}`);
            }
        }
    }
};

module.exports = expansionManager;
