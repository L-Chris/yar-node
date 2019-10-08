import Serialize from 'php-serialize'

class PhpPackager implements PackagerInterface {
  name: string;
  constructor() {
    this.name = 'php';
  }

  pack(payload: Object) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an Object');
    }
    return Serialize.serialize(payload);
  }

  unpack(packet: Buffer) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer Object');
    }
    return Serialize.unserialize(packet);
  }
}

export {
  PhpPackager
}
