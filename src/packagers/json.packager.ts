class JSONPackager implements PackagerInterface {
  name: String;
  constructor() {
    this.name = 'json';
  }

  pack(payload: Object) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an Object');
    }
    return JSON.stringify(payload);
  }

  unpack(packet: Buffer) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer Object');
    }
    return JSON.parse(packet.toString('utf-8'));
  }
}

export {
  JSONPackager
}
