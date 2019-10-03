const YAR_PROTOCOL_MAGIC_NUM = 0x80DFEC60
const YAR_PROTOCOL_VERSION = 0
const YAR_PROTOCOL_RESERVED = 0

const encode = (id, provider, token, body_len) => {
  const header = Buffer.alloc(82)

  header.writeUInt32BE(id, 0)
  header.writeUInt16BE(YAR_PROTOCOL_VERSION, 4)
  header.writeUInt32BE(YAR_PROTOCOL_MAGIC_NUM, 6)
  header.writeUInt32BE(YAR_PROTOCOL_RESERVED, 10)

  if (provider) {
    header.write(provider, 14, 'utf-8')
  }

  if (token) {
    header.write(token, 46, 'utf-8')
  }

  header.writeUInt32BE(body_len, 78)

  return header
}

const decode = (packet) => {
  if (!Buffer.isBuffer(packet)) {
    throw new Error('Param packet is not a Buff')
  }

  if (packet.length <= 90) {
    throw new Error("Param packet's length is invalid")
  }

  const header = {
    id: packet.readUInt32BE(0),
    version: packet.readUInt16BE(4),
    magic_num: packet.readUInt32BE(6),
    provider: packet.slice(14, 45).toString().trim(),
    toekn: packet.slice(46, 77).toString().trim(),
    body_len: packet.readUInt32BE(78)
  }

  return {
    header
  }
}

module.exports = {
  encode,
  decode
}
