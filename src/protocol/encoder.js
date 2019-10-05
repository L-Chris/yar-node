const { Transform } = require('stream')
const { Packager } = require('../packagers/packager')
const { noop } = require('../utils')
const { HEADER_LEN, PACKAGER_NAME_LEN } = require('../const')

const YAR_PROTOCOL_MAGIC_NUM = 0x80DFEC60
const YAR_PROTOCOL_VERSION = 0
const YAR_PROTOCOL_RESERVED = 0

class ProtocolEncoder extends Transform {
  constructor(options = {}) {
    super(options)
    this.options = options

    this._limited = false
    this._queue = []

    this.once('close', () => { this._queue = [] })
    this.on('drain', () => {
      this._limited = false
      do {
        const item = this._queue.shift()
        if (!item) break

        const [packet, callback] = item
        this._writePacket(packet, callback)
      } while(!this._limited)
    })
  }

  writeRequest(req, callback = noop) {
    this._writePacket({
      type: 'request',
      ...req
    }, callback)
  }

  writeResponse(res, callback = noop) {
    this._writePacket({
      type: 'response',
      ...res
    }, callback)
  }

  _writePacket(packet, callback) {
    if (this._limited) {
      this._queue.push([packet, callback])
    } else {
      let buf;
      try {
        buf = this['_' + packet.type + 'Encode'](packet);
      } catch (err) {
        return callback(err, packet);
      }
      // @refer: https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback
      // The return value is true if the internal buffer is less than the highWaterMark configured
      // when the stream was created after admitting chunk. If false is returned, further attempts to
      // write data to the stream should stop until the 'drain' event is emitted.
      this._limited = !this.write(buf, err => {
        callback(err, packet);
      });
    }
  }

  _requestEncode(packet) {
    const payload = {
      i: packet.id,
      m: packet.method,
      p: packet.params
    }

    const packager = Packager.get(packet.packager)
    const packagerNameBuf = Buffer.alloc(8)
    packagerNameBuf.write(packet.packager, 0, PACKAGER_NAME_LEN, 'utf-8')
    const body = Buffer.from(packager.pack(payload))
    const header = Buffer.alloc(82)
    header.writeUInt32BE(packet.id, 0)
    header.writeUInt16BE(YAR_PROTOCOL_VERSION, 4)
    header.writeUInt32BE(YAR_PROTOCOL_MAGIC_NUM, 6)
    header.writeUInt32BE(YAR_PROTOCOL_RESERVED, 10)

    if (packet.provider) {
      header.write(packet.provider, 14, 'utf-8')
    }

    if (packet.token) {
      header.write(packet.token, 46, 'utf-8')
    }

    header.writeUInt32BE(body.length + PACKAGER_NAME_LEN, 78)

    return Buffer.concat([header, packagerNameBuf, body], HEADER_LEN + PACKAGER_NAME_LEN + body.length)
  }

  _responseEncode(packet) {
    const payload = {
      i: packet.id,
      s: 0,
      r: packet.result,
      o: '',
      e: ''
    }

    const packager = Packager.get(packet.packager)
    const packagerNameBuf = Buffer.alloc(8)
    packagerNameBuf.write(packet.packager, 0, PACKAGER_NAME_LEN, 'utf-8')
    const body = Buffer.from(packager.pack(payload))
    const header = Buffer.alloc(82)
    header.writeUInt32BE(packet.id, 0)
    header.writeUInt16BE(YAR_PROTOCOL_VERSION, 4)
    header.writeUInt32BE(YAR_PROTOCOL_MAGIC_NUM, 6)
    header.writeUInt32BE(YAR_PROTOCOL_RESERVED, 10)

    if (packet.provider) {
      header.write(packet.provider, 14, 'utf-8')
    }

    if (packet.token) {
      header.write(packet.token, 46, 'utf-8')
    }

    header.writeUInt32BE(body.length + PACKAGER_NAME_LEN, 78)

    return Buffer.concat([header, packagerNameBuf, body], HEADER_LEN + PACKAGER_NAME_LEN + body.length)
  }

  _transform(chunk, encoding, callback) {
    callback(null, chunk)
  }
}

exports.ProtocolEncoder = ProtocolEncoder
