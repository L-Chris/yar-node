import * as msgpack from 'msgpack';

class MsgpackPackager implements PackagerInterface {
  type: string;
  constructor() {
    this.type = 'msgpack';
  }

  pack(payload: object) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an object');
    }
    return msgpack.pack(payload);
  }

  unpack(packet: Buffer) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer object');
    }
    return msgpack.unpack(packet);
  }
}

export {
  MsgpackPackager,
};
