'use strict';



const CoffeeMachine = require('./coffee-machine');

const coffeeMachine = new CoffeeMachine([0.05, 0.08, 0.10, 6.01, 6.70, 6.11, 6.03, 0.04, 0.08, 0.03, 0.07]);

coffeeMachine.on(CoffeeMachine.STAND_BY, () => console.log('STANDBY'));
coffeeMachine.on(CoffeeMachine.WORKING, () => console.log('WORKING'));
coffeeMachine.on(CoffeeMachine.FINISH, () => console.log('FINISH'));

coffeeMachine.powerOn();