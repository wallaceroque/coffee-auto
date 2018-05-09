'use strict';

const EventEmitter = require('events');
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;

class CoffeeMachine extends EventEmitter {
    constructor(address) {
        super();

        //if (!array || array.length <= 0) throw new Error('Array not defined!!');

        //this._array = array;
        this._port = new SerialPort(address || process.env.SERIAL_PORT_ADDRESS, {
            baudRate: 9600,
            dataBits: 8, 
            parity: 'none', 
            stopBits: 1, 
            flowControl: false 
        });

        this._port.pipe(new ReadLine());

        this._status = { 
            current: CoffeeMachine.POWER_OFF,
            previous: null,
        }

        /*this.on(CoffeeMachine.STAND_BY, () => this._status.current = CoffeeMachine.STAND_BY);
        this.on(CoffeeMachine.WORKING, () => this._status.current = CoffeeMachine.WORKING);
        this.on(CoffeeMachine.FINISH, () => this._status.current = CoffeeMachine.FINISH);
        */
    }

    powerOn() {
        const rgx = new RegExp(/\d.\d\d/);
        this._port.on('open', () => {
            console.log('\n Coffee Machine connected! \n');
            this._port.on('data', data => {
                let irms = Number.parseFloat(rgx.exec(data.toString())[0]);
                //console.log(irms);
                this._status.previous = this._status.current;
                if (irms < 6.00 && this._status.previous === CoffeeMachine.WORKING) {
                    this._status.current = CoffeeMachine.FINISH;
                    if (this._status.previous !== CoffeeMachine.FINISH)
                        this.emit(CoffeeMachine.FINISH);
                } else if (irms >= 6.00) {
                    this._status.current = CoffeeMachine.WORKING
                    if (this._status.previous !== CoffeeMachine.WORKING)
                        this.emit(CoffeeMachine.WORKING);
                } else {
                    this._status.current = CoffeeMachine.STAND_BY;
                    if (this._status.previous != CoffeeMachine.STAND_BY)
                        this.emit(CoffeeMachine.STAND_BY);
                }
            });  
        });
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