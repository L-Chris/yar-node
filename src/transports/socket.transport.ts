import * as net from 'net';
import * as pump from 'pump';
import { ProtocolDecoder } from '../decoder';
import { ProtocolEncoder } from '../encoder';
import { nextId } from '../utils';

class SocketTransport implements YarTransport {
  connection: any;
  port: number;
  host: string;
  constructor(host: string, port: number) {
    this.host = host
    this.port = port
    this.init();
  }

  init() {
    this.connection = net.connect(this.port, this.host);

    const encoder = new ProtocolEncoder()
    const decoder = new ProtocolDecoder()

    this.connection.once('connect', this.handleConnect)
    this.connection.once('error', this.handleError)
    this.connection.once('close', this.handleClose)

    pump(encoder, this.connection, decoder, (err) => {
      this.handleError(err)
    })

    decoder.on('response', res => {
      console.log(res)
    })

    const id = nextId();

    encoder.writeRequest({
      id
    })
  }

  handleConnect() {}
  handleClose() {}
  handleError(err: Error) {
    console.log(err)
  }
}

export {
  SocketTransport,
};
