
class JSONPackager {
  pack(packet) {
    if (typeof packet !== 'object') {
      throw new Error('packet is not an Object')
    }

    return JSON.stringify(packet)
  }

  unpack(packet) {
    if (!Buffer.isBuffer(packet)) {
      throw new Error('packet it not a Buffer Object')
    }

    return JSON.parse(packet.toString('utf-8', 0, packet.length))
  }
}

exports.JSONPackager = JSONPackager
