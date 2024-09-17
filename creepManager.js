const roleHarvester = require('role.harvester');
const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const roleDefender = require('role.defender');
const roleRunner = require('role.runner');

const creepManager = {
    run: function(creep) {
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'defender':
                roleDefender.run(creep);
                break;
            case 'runner':
                roleRunner.run(creep);
                break;
            default:
                console.log(`Creep ${creep.name} has no valid role!`);
        }
    }
};

module.exports = creepManager;
