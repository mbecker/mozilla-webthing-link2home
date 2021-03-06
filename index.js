// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

const {
    Action,
    Event,
    Property,
    MultipleThings,
    Thing,
    Value,
    WebThingServer,
} = require('webthing');
const { v4: uuidv4 } = require('uuid');

const udp = require('dgram');
// creating a client socket
const client = udp.createSocket('udp4');

const convert = (from, to) => str => Buffer.from(str, from).toString(to)
const utf8ToHex = convert('utf8', 'hex')
const hexToUtf8 = convert('hex', 'utf8')


/**
 * Extracts the MAC adress form the hex messages returned from the Link2HomeDevice via UDP
 * @param {string} hexMsg - The message in HEX format ('a10498d8632796860009bc2d02f271500301ff')
 * @returns {string} - The MAC adress
 */
const extractMacFromHex = (hexMsg) => hexMsg.slice(UDP_DATA_START.length, hexMsg.length - UDP_DATA_END.length - UDP_COMMAND_ON.length);

/**
 * Extracts the HEX value command from the HEX message sent by the Link2Home device
 * @param {string} hexMsg - The message in HEX format ('a10498d8632796860009bc2d02f271500301ff')
 * @returns {string} - The command in HEX like 'ff' or '00'
 */
const extractCommandFromHex = (hexMsg) => hexMsg.slice(hexMsg.length - 2, hexMsg.length);
/**
 * Maps the extracted command in HEX value to the Thing @type 'LockedProperty's status enum: "locked", "unlocked", "unknown", "jammed"
 * @param {string} hexMsg - The message in HEX format ('a10498d8632796860009bc2d02f271500301ff')
 * @returns {string} - The command in HEX like 'ff' or '00'
 */
const getLockStatus = (command) => {
    command = command.toLowerCase();
    if (command === UDP_COMMAND_ON.toLowerCase()) return 'unlocked';
    if (command === UDP_COMMAND_OFF.toLowerCase()) return 'locked';
    if (command === UDP_COMMAND_STOP.toLowerCase()) return 'jammed';
    return 'unknown';
}


/*
 * UDP Data packet for the Link2Home Devices is defined as follows:
 * UDP_DATA_START + MAC ADRESS OF LINK2HOME DEVICE + UDP_DATA_END + UDP_COMMAND
 */
const UDP_DATA_START = 'a104';
const UDP_DATA_END = '000901f202d171500101';

const UDP_COMMAND_ON = 'ff'; // Hoch
const UDP_COMMAND_OFF = '00'; // Runter
const UDP_COMMAND_STOP = '02'; // Stopp
const UDP_COMMAND_INFO = '23';




/**
 * A number, or a string containing a number.
 * @typedef {Object} Link2HomeDevice
 * @property {string} mac - The Mac adress of the device in the format as follow: '98d863279686' (without ':' or white spaces)
 * @property {string} title - The title of the device for the webnode thing
 * @property {description} description - The description of the device for the webnode thing
 */


// MOVE DOWN
class LockAction extends Action {
    constructor(thing, input) {
        super(uuidv4(), thing, 'lock', input);
    }

    performAction() {
        return new Promise((resolve) => {
            const data = UDP_DATA_START + this.thing.id + UDP_DATA_END + UDP_COMMAND_OFF;
            const data1 = Buffer.from(data, 'hex');
            
            // Send UDP data packet to device to "Lock down the shutter (off)"
            client.send(data1, 35932, "192.168.0.255", error => {
                if (error) {
                    console.log(error)
                } else {
                    this.thing.setProperty('shutter', 'jammed');
                }
            })
            resolve();
        });
    }
}

// MOVE UP
class UnlockAction extends Action {
    constructor(thing, input) {
        super(uuidv4(), thing, 'unlock', input);
    }

    performAction() {
        return new Promise((resolve) => {
            const data = UDP_DATA_START + this.thing.id + UDP_DATA_END + UDP_COMMAND_ON;
            const data1 = Buffer.from(data, 'hex');
            

            // Send UDP data packet to device to "unlock up the shutter (on)"
            client.send(data1, 35932, "192.168.0.255", error => {
                if (error) {
                    console.log(error)
                } else {
                    this.thing.setProperty('shutter', 'jammed');
                }
            })
            resolve();
        });
    }
}

class StopAction extends Action {
    constructor(thing, input) {
        super(uuidv4(), thing, 'stop', input);
    }

    performAction() {
        return new Promise((resolve) => {
            const data = UDP_DATA_START + this.thing.id + UDP_DATA_END + UDP_COMMAND_STOP;
            const data1 = Buffer.from(data, 'hex');

            // Send UDP data packet to device to "stop up the shutters"
            client.send(data1, 35932, "192.168.0.255", error => {
                if (error) {
                    console.log(error)
                } else {
                    this.thing.setProperty('shutter', 'jammed');
                }
            })
            resolve();
        });
    }
}

/**
 * Make athing for a Linke2Home Device
 * @param {Link2HomeDevice} link2homedevice - The Linke2Home Device
 * @param {string} author - The author of the book.
 * @returns {Thing} - The webnode thing
 */
function makeThing(link2homedevice) {
    const thing = new Thing(
        link2homedevice.mac,
        link2homedevice.title,
        ['Lock'],
        link2homedevice.description
    );

    thing.addProperty(
        new Property(thing,
            'shutter',
            new Value('unlocked', (value) => {
                console.log(`::: NEW Value set ::: value - ${value}`);
            }),
            {
                '@type': 'LockedProperty',
                title: 'Status',
                type: 'string',
                enum: ["locked", "unlocked", "unknown", "jammed"],
                description: 'Whether the jalouse is locked/unlocked/jammed',
            }));

    thing.addAvailableAction('Hoch',
        {
            'title': 'Hoch',
            'description': 'Rolladen hoch',

        }, UnlockAction);

    thing.addAvailableAction('Runter',
        {
            'title': 'Runter',
            'description': 'Rolladen Runter',

        }, LockAction);

    thing.addAvailableAction('Stop',
        {
            'title': 'Stop',
            'description': 'Rolladen Stop',

        }, StopAction);




    return thing;
}

function runServer() {
    /**
     * List of things
     * @type {Thing[]}
     */
    const things = [];
    /**
     * Link2Home Devices list to create a webode thing for each device
     * @type {Link2HomeDevice[]]}
     */
    const link2homedevices = {
        '98d863279686': {
            mac: '98d863279686',
            title: 'Rolladen Links',
            description: 'Rolladen Links',
            thing: undefined
        },
        '98d863845a09': {
            mac: '98d863845a09',
            title: 'Rolladen Rechts',
            description: 'Rolladen Rechts',
            thing: undefined
        },
    }

    // Create the Webthing Things
    for (const key in link2homedevices) {
        const link2homedevice = link2homedevices[key];
        const thing = makeThing(link2homedevice);
        link2homedevices[key]['thing'] = thing;
        things.push(link2homedevices[key]['thing']);
    }

    // If adding more than one thing, use MultipleThings() with a name.
    // In the single thing case, the thing's name will be broadcast.
    const server = new WebThingServer(new MultipleThings(things), 8889);

    process.on('SIGINT', () => {
        server.stop().then(() => process.exit()).catch(() => process.exit());
        client.close();
    });

    server.start().catch(console.error);

    /*
     * UDP Client
     */

     // UPD Client eventlistener for 'onmessage'
     // Find for each incoming message the corresponding link2homedevice and it's Webthing Thing
     // Set the Webthing Thing's property 'shutter' to the status of the incoming parsed message
    client.on('message', function (msg, info) {
        const hexMsg = utf8ToHex(msg);
        const command = extractCommandFromHex(hexMsg);
        const status = getLockStatus(command);
        const macAdress = extractMacFromHex(hexMsg);

        console.log(`::: message :::`);

        console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
        console.log('Data received from server : ' + utf8ToHex(msg));
        console.log('Device: ', macAdress);
        console.log('Status: ', status);


        if (Object.prototype.hasOwnProperty.call(link2homedevices, macAdress)) {
            console.log(`::: Device found ::: Update property 'shutter' to - ${macAdress} -> ${status}`);
            const thing = link2homedevices[macAdress]['thing'];
            thing.setProperty('shutter', status);
        }

    });

    client.on("listening", function () {
        console.log("UDP Client listening on ", client.address());
        client.setBroadcast(true);
        client.setTTL(64);
        client.setMulticastTTL(64);
        client.setMulticastLoopback(true);

        // Send a message to each device to requests it's status; the event listener client.on('message') should then handle the incoming message with the status tu update the property status of the device
        for (const key in link2homedevices) {
            const link2homedevice = link2homedevices[key];
            const data = UDP_DATA_START + link2homedevice['mac'] + UDP_DATA_END + UDP_COMMAND_STOP;
            const data1 = Buffer.from(data, 'hex');
            client.send(data1, 35932, "192.168.0.255", (err) => {
                if (err) console.log(err);
            });
        }
    });
    client.on("close", function () {
        console.log("UDP Client closed");
    });
    client.on("error", function (err) {
        console.log("UDP Client error: ", err);
    });
    client.bind(35932);
}

runServer();