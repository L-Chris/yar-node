const Serialize = require('php-serialize')

class PhpPackager {
  constructor() {
    this.name = 'php'
  }

  pack(payload) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an Object')
    }

    return Serialize.serialize(payload)
  }

  unpack(packet) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer Object')
    }
    return Serialize.unserialize(packet)
  }
}

exports.PhpPackager = PhpPackager
