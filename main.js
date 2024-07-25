var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

const towerLogic = require('tower');
const autospawn = require('autospawn');

module.exports.loop = function () {

    //clear memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //filter game structures for just towers 
    var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        towerLogic.run(tower);
    }

    //call autospawn
    autospawn.run();

    //run creeps
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}