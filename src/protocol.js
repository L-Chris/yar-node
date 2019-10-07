const { Packager } = require('./packagers/packager')
const { HEADER_LEN, PACKAGER_NAME_LEN } = require('./const')

const YAR_PROTOCOL_MAGIC_NUM = 0x80DFEC60
const YAR_PROTOCOL_VERSION = 0
const YAR_PROTOCOL_RESERVED = 0

const encode = (obj, options = {}) => {
  const packager = Packager.get(obj.packager)
  const packagerNameBuf = Buffer.alloc(8)
  packagerNameBuf.write(obj.packager, 0, PACKAGER_NAME_LEN, 'utf-8')
  const body = Buffer.from(packager.pack(obj.payload))
  const header = Buffer.alloc(82)
  header.writeUInt32BE(obj.id, 0)
  header.writeUInt16BE(YAR_PROTOCOL_VERSION, 4)
  header.writeUInt32BE(YAR_PROTOCOL_MAGIC_NUM, 6)
  header.writeUInt32BE(YAR_PROTOCOL_RESERVED, 10)

  if (obj.provider) {
    header.write(obj.provider, 14, 'utf-8')
  }

  if (obj.token) {
    header.write(obj.token, 46, 'utf-8')
  }

  header.writeUInt32BE(body.length + PACKAGER_NAME_LEN, 78)
  return Buffer.concat([header, packagerNameBuf, body], HEADER_LEN + PACKAGER_NAME_LEN + body.length)
}

const decode = (buf, options = {}) => {
  const id = buf.readUInt32BE(0)
  const protocolVersion = buf.readUInt16BE(4)
  const magicNumber = buf.readUInt32BE(6)
  const reserved = buf.readUInt32BE(10)
  const bodyLength = buf.readUInt32BE(78)

  const packagerName = buf.slice(HEADER_LEN, HEADER_LEN + PACKAGER_NAME_LEN).toString('utf-8').trim().replace(/\0/g, '')
  const packager = Packager.get(packagerName)
  const body = packager.unpack(buf.slice(HEADER_LEN + PACKAGER_NAME_LEN, HEADER_LEN + bodyLength))

  return {
    id,
    protocolVersion,
    magicNumber,
    reserved,
    packagerName,
    bodyLength,
    body
  }
}

const requestEncode = (id, req, options) => {
  const payload = {
    i: id,
    m: req.methodName,
    p: req.args
  }

  return encode({
    id,
    token: req.token,
    provider: req.provider,
    packager: req.packager,
    payload
  })
}

const responseEncode = (id, res, options) => {
  const payload = {
    i: id,
    s: res.status || 0,
    r: res.data,
    o: '',
    e: ''
  }

  return encode({
    id,
    token: res.token,
    provider: res.provider,
    packager: res.packager,
    payload
  })
}



exports.requestEncode = requestEncode
exports.responseEncode = responseEncode
exports.encode = encode
exports.decode = decode
