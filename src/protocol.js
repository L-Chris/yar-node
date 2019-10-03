const YAR_PROTOCOL_MAGIC_NUM = 0x80DFEC60
const YAR_PROTOCOL_VERSION = 0
const YAR_PROTOCOL_RESERVED = 0

const render = (id, provider, token, bodyLength) => {
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

  header.writeUInt32BE(bodyLength, 78)

  return header
}

const parse = packet => {
  const id = packet.readUInt32BE(0)
  const protocolVersion = packet.readUInt16BE(4)
  const protocolMagicNumber = packet.readUInt32BE(6)
  const reserved = packet.readUInt32BE(10)
  const bodyLength = packet.readUInt32BE(78)

  return {
    id,
    protocolVersion,
    protocolMagicNumber,
    reserved,
    bodyLength
  }
}

exports.render = render
exports.parse = parse
