import * as Serialize from 'php-serialize';

class PhpPackager implements PackagerInterface {
  type: string;
  constructor() {
    this.type = 'php';
  }

  pack(payload: object) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an object');
    }
    return Serialize.serialize(payload);
  }

  unpack(packet: Buffer) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer object');
    }
    return Serialize.unserialize(packet);
  }
}

export {
  PhpPackager,
};
