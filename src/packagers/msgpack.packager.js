const msgpack = require('msgpack')

class MsgpackPackager {
  pack(payload) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an Object')
    }

    return msgpack.pack(payload)
  }

  unpack(packet) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer Object')
    }
    return msgpack.unpack(packet)
  }
}

exports.MsgpackPackager = MsgpackPackager
