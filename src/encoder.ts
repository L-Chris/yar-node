import { Transform, TransformCallback } from 'stream';
import protocol from './protocol';
import { noop } from './utils';

class ProtocolEncoder extends Transform {
  private limited: boolean;
  private queue: Array<[Packet, (err: Error, packet: Packet) => void]>;
  options: object;
  constructor(options = {}) {
    super(options);
    this.options = options;

    this.limited = false;
    this.queue = [];

    this.once('close', () => { this.queue = []; });
    this.on('drain', () => {
      this.limited = false;
      do {
        const item = this.queue.shift();
        if (!item) {
          break;
        }

        const [packet, callback] = item;
        this._writePacket(packet, callback);
      } while (!this.limited);
    });
  }

  writeRequest(req: YarRequest, callback = noop) {
    this._writePacket({
      packetId: req.id,
      packetType: 'request',
      req,
    }, callback);
  }

  writeResponse(req: YarRequest, res: YarResponse, callback = noop) {
    this._writePacket({
      packetId: req.id,
      packetType: 'response',
      req,
      res,
    }, callback);
  }

  _writePacket(packet: Packet, callback: (err: Error, packet: Packet) => void) {
    if (this.limited) {
      this.queue.push([packet, callback]);
    } else {
      let buf: null | Buffer;
      try {
        if (packet.packetType === 'request') {
          buf = this._requestEncode(packet);
        } else {
          buf = this._responseEncode(packet);
        }

      } catch (err) {
        return callback(err, packet);
      }
      // @refer: https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback
      // The return value is true if the internal buffer is less than the highWaterMark configured
      // when the stream was created after admitting chunk. If false is returned, further attempts to
      // write data to the stream should stop until the 'drain' event is emitted.
      this.limited = !this.write(buf, err => {
        callback(err, packet);
      });
    }
  }

  _requestEncode(packet: Packet) {
    const { packetId, req } = packet;

    return protocol.requestEncode(packetId, req);
  }

  _responseEncode(packet: Packet) {
    const { packetId, res } = packet;

    return protocol.responseEncode(packetId, res);
  }

  _transform(chunk: Buffer, encoding: string, callback: TransformCallback) {
    callback(null, chunk);
  }
}

export {
  ProtocolEncoder,
};
