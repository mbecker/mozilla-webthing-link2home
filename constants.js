/*
 * Link2Home Device commands in hex format
 * Reference: https://github.com/g3gg0/Sonoff-Tasmota/blob/215ed4a7ce78aa38277f6049481e017064713ce9/sonoff/l2h.h#L33
 */


export const L2H_CMD_SWITCH         = 0x01;
export const L2H_CMD_UNK_02         = 0x02
export const L2H_CMD_SWITCH_REPORT  = 0x03
export const L2H_CMD_SCHED          = 0x04
export const L2H_CMD_STATUS_05      = 0x05
export const L2H_CMD_COUNTDOWN      = 0x07
export const L2H_CMD_UNK_08         = 0x08
export const L2H_CMD_UNK_0B         = 0x0B
export const L2H_CMD_SET_ALLID      = 0x0F
export const L2H_CMD_ALLID          = 0x10
export const L2H_CMD_UNK_12         = 0x12
export const L2H_CMD_UNPAIR_14      = 0x14
export const L2H_CMD_ANNCOUNCE      = 0x23
export const L2H_CMD_PAIR_24        = 0x24
export const L2H_CMD_BALANCE        = 0x41
export const L2H_CMD_LOGIN          = 0x42
export const L2H_CMD_CITYID         = 0x44
export const L2H_CMD_ZONEID         = 0x45
export const L2H_CMD_LUMEN          = 0x46 /* 1 byte data */
export const L2H_CMD_COLWHITE       = 0x47 /* 1 byte data */
export const L2H_CMD_COLRGB         = 0x48 /* 3 byte data */
export const L2H_CMD_MAXBR          = 0x49 /* 1 byte data, 00 = low, c8 = max */
export const L2H_CMD_LUMDUR         = 0x50 /* 1 byte data */
export const L2H_CMD_SENSLVL        = 0x51 /* 1 byte data */
export const L2H_CMD_LUX            = 0x52 /* 2 byte data */
export const L2H_CMD_ONDUR          = 0x53 /* 2 byte data */
export const L2H_CMD_SENSMODE       = 0x58
export const L2H_CMD_TEST           = 0x59
export const L2H_CMD_UNK_5B         = 0x5B /* 1 byte data */
export const L2H_CMD_LAMPMODE       = 0x55 /* 1 byte data, 00 = sensor, 01 = on, 02 = off, 03 = timed, 04 = random */
export const L2H_CMD_PANIC          = 0x5C /* 1 byte data, 00 = off, 01 = on */
export const L2H_CMD_IDLE           = 0x61
export const L2H_CMD_VERSION        = 0x62
export const L2H_CMD_FWUP           = 0x63

export const L2H_PKT_HDR            = 0xA1;
export const L2H_PKT_DIRECT         = 0x00;
export const L2H_PKT_REQUEST        = 0x04;
export const L2H_PKT_RESPONSE       = 0x02;