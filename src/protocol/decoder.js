const { Writable } = require('stream')
const { HEADER_LEN, PACKAGER_NAME_LEN } = require('../const')
const { Packager } = require('../packagers/packager')

class ProtocolDecoder extends Writable {
  constructor(options = {}) {
    super(options = {})

    this._buf = null
    this.options = options
  }

  _write(chunk, encoding, callback) {
    this._buf = this._buf ? Buffer.concat([this._buf, chunk]) : chunk
    let unfinish = false
    do {
      unfinish = this._decode()
    } while(unfinish)
    callback()
  }

  _decode() {
    const bufLength = this._buf.length
    const bodyLength = this._buf.readInt32BE(78)
    const packetLength = HEADER_LEN + bodyLength
    if (packetLength === 0 || bufLength < packetLength) {
      return false
    }

    const packet = this._buf.slice(0, packetLength)
    const packagerName = packet.slice(HEADER_LEN, HEADER_LEN + PACKAGER_NAME_LEN).toString('utf-8').trim().replace(/\0/g, '')
    const packager = Packager.get(packagerName)
    const data = packager.unpack(packet.slice(HEADER_LEN + PACKAGER_NAME_LEN, packetLength))
    const obj = {
      id: packet.readInt32BE(0),
      version: packet.readUInt16BE(4),
      magicNumber: packet.readUInt32BE(6),
      reserved: packet.readUInt32BE(10),
      bodyLength,
      packagerName,
      data
    }

    this.emit(data.m ? 'request' : 'response', obj)

    const restLength = bufLength - packetLength

    if (restLength) {
      this._buf = this._buf.slice(packetLength)
      return true
    }
    this._buf = null
    return false
  }

  _destroy() {
    this._buf = null
    this.emit('close')
  }
}

exports.ProtocolDecoder = ProtocolDecoder
