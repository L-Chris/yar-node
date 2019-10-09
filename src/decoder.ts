import { Writable } from 'stream';
import protocol from './protocol';
import { HEADER_LEN } from './const';

class ProtocolDecoder extends Writable {
  private buf: Buffer;
  private options: object;
  constructor(options = {}) {
    super(options = {});

    this.buf = null;
    this.options = options;
  }

  _write(chunk: Buffer, encoding: string, callback: () => void) {
    this.buf = this.buf ? Buffer.concat([this.buf, chunk]) : chunk;
    let unfinish = false;
    do {
      unfinish = this._decode();
    } while (unfinish);
    callback();
  }

  _decode() {
    const bufLength = this.buf.length;
    const bodyLength = this.buf.readInt32BE(78);
    const packetLength = HEADER_LEN + bodyLength;
    if (packetLength === 0 || bufLength < packetLength) {
      return false;
    }

    const packet = this.buf.slice(0, packetLength);
    const obj = protocol.decode(packet);
    this.emit(obj.body.m ? 'request' : 'response', obj);

    const restLength = bufLength - packetLength;
    if (restLength) {
      this.buf = this.buf.slice(packetLength);
      return true;
    }
    this.buf = null;
    return false;
  }

  _destroy() {
    this.buf = null;
    this.emit('close');
  }
}

export {
  ProtocolDecoder,
};
