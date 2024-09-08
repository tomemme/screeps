// Import all the required modules
const creepManager = require('creepManager');
const roomManager = require('roomManager');
const defenseManager = require('defenseManager');
const taskManager = require('taskManager');
const creepFactory = require('creepFactory');

module.exports.loop = function() {
    // Performance Monitoring
    const startCpu = Game.cpu.getUsed();

    // Clean memory of dead creeps
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log(`Clearing non-existing creep memory: ${name}`);
        }
    }

    // Manage each room
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        roomManager.run(room);
        defenseManager.run(room);

        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
        const defenders = _.filter(Game.creeps, (creep) => creep.memory.role === 'defender');
    
        // Adjust these numbers based on room needs
        if (harvesters.length < 3) {
            creepFactory.createCreep(room, 'harvester');
        } else if (builders.length < 2) {
            creepFactory.createCreep(room, 'builder');
        } else if (upgraders.length < 2) {
            creepFactory.createCreep(room, 'upgrader');
        } else if (defenders.length < 1) {
            creepFactory.createCreep(room, 'defender');
        }
    }

    // Manage creeps (assign tasks)
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        creepManager.run(creep);
        taskManager.assignTask(creep);
    }

    // Manage defense tasks
    defenseManager.run();

    // Performance logging (optional, remove in production)
    console.log(`Main loop CPU usage: ${Game.cpu.getUsed() - startCpu}`);
}
