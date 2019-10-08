import * as msgpack from 'msgpack'

class MsgpackPackager implements PackagerInterface {
  name: string;
  constructor() {
    this.name = 'msgpack';
  }

  pack(payload: Object) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an Object');
    }
    return msgpack.pack(payload);
  }

  unpack(packet: Buffer) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer Object');
    }
    return msgpack.unpack(packet);
  }
}

export {
  MsgpackPackager
}
