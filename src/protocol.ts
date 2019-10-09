import { getPackager } from './packagers'
import { HEADER_LEN, PACKAGER_NAME_LEN } from './const'

const YAR_PROTOCOL_MAGIC_NUM = 0x80DFEC60
const YAR_PROTOCOL_VERSION = 0
const YAR_PROTOCOL_RESERVED = 0

const encode = (obj: YarPacket) => {
  const packager = getPackager(obj.packager)
  const packagerNameBuf = Buffer.alloc(8)
  packagerNameBuf.write(obj.packager, 0, PACKAGER_NAME_LEN, 'utf-8')
  const body = Buffer.from(packager.pack(obj.body))
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

const decode = (buf: Buffer): YarPacket => {
  const id = buf.readUInt32BE(0)
  const protocolVersion = buf.readUInt16BE(4)
  const magicNumber = buf.readUInt32BE(6)
  const reserved = buf.readUInt32BE(10)
  const bodyLength = buf.readUInt32BE(78)

  const packagerName = buf.slice(HEADER_LEN, HEADER_LEN + PACKAGER_NAME_LEN).toString('utf-8').trim().replace(/\0/g, '')
  const packager = getPackager(packagerName)
  const body = packager.unpack(buf.slice(HEADER_LEN + PACKAGER_NAME_LEN, HEADER_LEN + bodyLength))

  return {
    id,
    protocolVersion,
    magicNumber,
    reserved,
    packager: packagerName,
    bodyLength,
    body
  }
}

const requestEncode = (id: number, req: YarRequest) => {
  const body = {
    i: id,
    m: req.methodName,
    p: req.args
  }

  return encode({
    id,
    token: req.token,
    provider: req.provider,
    packager: req.packager,
    body
  })
}

const responseEncode = (id: number, res: YarResponse) => {
  const body = {
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
    body
  })
}

export default {
  requestEncode,
  responseEncode,
  encode,
  decode
}
