'use strict';

const EventEmitter = require('events');

class CoffeeMachine extends EventEmitter {
    constructor(array) {
        super();

        if (!array || array.length <= 0) throw new Error('Array not defined!!');

        this._array = array;
        this._status = { 
            current: CoffeeMachine.POWER_OFF,
            previous: null,
        }

        this.on(CoffeeMachine.STAND_BY, () => this._status.current = CoffeeMachine.STAND_BY);
        this.on(CoffeeMachine.WORKING, () => this._status.current = CoffeeMachine.WORKING);
        this.on(CoffeeMachine.FINISH, () => this._status.current = CoffeeMachine.FINISH);
    }

    powerOn() {
        const sleep = ms => new Promise(res => setTimeout(res, ms));

        const read = (num, cb) => sleep(1500).then(() => {
            cb && cb();
        });

        this._array.reduce((promise, element) => {
            return promise.then(() => read(element, () => {
                this._status.previous = this._status.current;

                if (element < 6.00 && this._status.previous === CoffeeMachine.WORKING)
                    this.emit(CoffeeMachine.FINISH);
                else if (element >= 6.00)
                    this.emit(CoffeeMachine.WORKING);
                else this.emit(CoffeeMachine.STAND_BY); 
            }));
        }, Promise.resolve());
    }

    static get POWER_OFF() {
        return 'POWER_OFF';
    }

    static get STAND_BY() {
        return 'STAND_BY';
    }

    static get WORKING() {
        return 'WORKING';
    }

    static get FINISH() {
        return 'FINISH';
    }
}

module.exports = CoffeeMachine;