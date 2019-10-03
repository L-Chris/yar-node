
class JSONPackager {
  pack(payload) {
    if (typeof payload !== 'object') {
      throw new Error('payload is not an Object')
    }

    return JSON.stringify(payload)
  }

  unpack(packet) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer Object')
    }
    return JSON.parse(packet.toString('utf-8'))
  }
}

exports.JSONPackager = JSONPackager
