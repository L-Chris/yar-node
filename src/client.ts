import * as http from 'http';
import { URL } from 'url';
import { getPackager } from './packagers';
import { ProtocolDecoder } from './decoder';
import { ProtocolEncoder } from './encoder';
import { nextId } from './utils';

export interface YarClientOptions {
  packager?: string;
}

class YarClient {
  private uri: URL;
  private protocol: string;
  private options: any;
  private packager: YarPackager;
  constructor(uri: string, options: YarClientOptions = {}) {
    const uriOptions = new URL(uri);

    this.uri = uriOptions;
    this.protocol = uriOptions.protocol;
    options.packager = options.packager || 'php';
    this.options = options;
    this.packager = getPackager(this.options.packager);
  }

  call(methodName: string, args: any, callback: (o: object) => void) {
    const options = {
      hostname: this.uri.hostname,
      port: this.uri.port,
      path: this.uri.pathname,
      protocol: this.uri.protocol,
      headers: {
        'User-Agent': `PHP Yar Rpc-0.0.1`,
        'Content-Type': 'application/octet-stream',
        'Transfer-Encoding': 'chunked',
        'Connection': 'Keep-Alive',
        'Keep-Alive': '300',
      },
    };

    const protocolEncoder = new ProtocolEncoder();
    const protocolDecoder = new ProtocolDecoder();

    const req = http.request(options, res => {
      res.pipe(protocolDecoder);
    });

    protocolEncoder.pipe(req);

    const id = nextId();

    protocolEncoder.writeRequest({
      id,
      packager: this.options.packager,
      methodName,
      args,
      timeout: 3000,
    });

    protocolDecoder.on('response', (res: YarResponsePacket) => {
      callback(res.body.r);
    });

    req.end();
  }

  setOpt(key: string, value: any) {
    this.options[key] = value;
  }
}

export {
  YarClient,
};
