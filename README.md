# Mozilla Wwebthing Link2Home

This repo includes an implementation of the Mozilla WebThing Node for the Wifi Shutter Switch ("WIFI JALOUSIESCHALTER") of Link2Home. The communication with the switches are via UDP.

The Link2Home Shutter Switch devices must be added in the code as a JSON with the MAC adress hardcoded.

The script creates a Webthing Thing of the @type 'Lock' with the poperty 'LockProperty'. The 'LockProperty' has an enum with the types: locked, unlocked, jammed, unknwon

## Usage of the commands - Important (!)

The Linke2Home Shutter Switch device can only request 1 x command in 2 minutes. That means the first command 'off' ('down') moves the shutter down. The next command (it could be any command like 'on'/'up' or 'off'/'down' or 'stop') stops the shutter! The next command is then requested as defined.

The process is as follows
```sh
(1) Command 'off' ('down') -> Shutter moves down
(2) - Within 2 minutes - Command 'on'/'off'/'stop' -> Shutter stops
(3) Command 'off' -> Shutter moves down (or command 'on' -> Shutter moves up)
```

## LockProperty status

The status of the property 'LockProperty' are implemented for the shutter as follows

| LockProperty status | Link2Home status | Real world status  |
|---------------------|------------------|--------------------|
| locked              | Off              | Shutter is down    |
| unlocked            | on               | Shutter is up      |
| jammed              | stop             | Shutter stopped    |
| uunknown            | -                | .                  |

## UPD Communication

Each Link2Home device listens and communicate it's status via UDP Port 35932.

The UPD data pakets are as follows (in hex format)

### UPD Data Paket

| Hex chars | Data / Value                       | Description                                                     |   |
|-----------|------------------------------------|-----------------------------------------------------------------|---|
| 0-4       | a104                               | Unknwon flag; mandatory and static for each command             |   |
| 5-16      | MAC Adress of the Link2Home device | The MAC adress of the Link2Home device (format: '98d863845a09') |   |
| 17-36     | 000901f202d171500101               | Unknwon flag; mandatory and static for each command             |   |
| 37-38     | Command                            | The commands in hex value as defined in the table 'UDP Link2Home Commands'    |   |

### UDP Link2Home Commands

| Hex values | Command    | Description                                                           |   |
|------------|------------|-----------------------------------------------------------------------|---|
| ff         | Up / On    | The command moves the shutter up (could be for other devices 'on')    |   |
| 00         | Down / Off | The command moves the shutter down [Webthing status: ] (could be for other devices 'off') |   |
| 02         | Stop       | The command stop the shutter                                          |   |
| 23         | Info?      | The command request the Link2Home device to answer (to be defined)    |   |

### UDP Data Paket Example

The following UDP data paket requests the device with mac '98d863845a09' to move the shutter down ('off' or status 'lock' for this Webthing implementation):

```sh
a10498d863845a090009e53002f27150030100

a104                    - Mandatory and static start flag (unknown)
98d863845a09            - MAC adresse
000901f202d171500101    - Mandatory and static end flag (unknown)
00                      - Command to shut down ('off' or status 'locked' / 'down')
```

## Resources

* Link2Home Wifi Shutter Switch ("WIFI JALOUSIESCHALTER"): https://www.l2h-rev.de/produkte/wifi-jalousie/
* Mozilla Webthing Node: https://github.com/mozilla-iot/webthing-node

## TODO

- [ ] Add / Update JSDOC
- [ ] Link2Home devices should be added via config JSON file
- [ ] UDP IP adress should be set by config file
- [ ] Create a Mozilla Gateway addon

