import * as http from 'http';
import * as pump from'pump';
import { ProtocolDecoder } from '../decoder';
import { ProtocolEncoder } from '../encoder';
import { nextId } from '../utils';

class HttpTransport implements YarTransport {
  connection: http.ClientRequest;
  options: any;
  constructor(options) {
    this.options = options;

    this.init();
  }

  init(options = {}) {
    const encoder = new ProtocolEncoder();
    const decoder = new ProtocolDecoder();

    this.connection = http.request(options, res => {
      pump(encoder, res, decoder, this.handleError)
    });

    decoder.on('response', res => {
      console.log(res)
    })

    const id = nextId();

    encoder.writeRequest({
      id
    });

    this.connection.end();
  }

  handleError(err: Error) {
    console.log(err)
  }
}

export {
  HttpTransport,
};
