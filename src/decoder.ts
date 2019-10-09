import { Writable } from 'stream'
import protocol from './protocol'
import { HEADER_LEN } from './const'

class ProtocolDecoder extends Writable {
  _buf: Buffer;
  options: Object;
  constructor(options = {}) {
    super(options = {})

    this._buf = null
    this.options = options
  }

  _write(chunk: Buffer, encoding: string, callback: Function) {
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
    const obj = protocol.decode(packet)
    this.emit('m' in obj.body ? 'request' : 'response', obj)

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

export {
  ProtocolDecoder
}
