class JSONPackager implements YarPackager {
  type: string;
  constructor() {
    this.type = 'json';
  }

  pack(payload: object) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an object');
    }
    return JSON.stringify(payload);
  }

  unpack(packet: Buffer) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer object');
    }
    return JSON.parse(packet.toString('utf-8'));
  }
}

export {
  JSONPackager,
};
