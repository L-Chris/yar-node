import * as http from 'http';
import { URL } from 'url';
import { ProtocolDecoder } from './decoder';
import { ProtocolEncoder } from './encoder';
import { mt_rand } from 'locutus/php/math'
import { YAR_CLIENT_PROTOCOL, PHP_YAR_VERSION, YAR_PACKAGER } from './const'

export interface YarClientOptions {
  packager?: string;
}

class YarClient {
  private uri: URL;
  private protocol: string;
  private options: any;
  private packager: string;
  constructor(uri: string, options: YarClientOptions = {}) {
    const uriOptions = new URL(uri);

    this.uri = uriOptions;
    this.protocol = uriOptions.protocol;
    this.packager = options.packager || 'php';
    if (YAR_CLIENT_PROTOCOL.HTTP !== this.protocol) {
      throw new Error(`unsupported protocol ${this.protocol}`)
    }

    if (![YAR_PACKAGER.PHP, YAR_PACKAGER.JSON, YAR_PACKAGER.MSGPACK].includes(this.packager)) {
      throw new Error(`unsupported packager ${this.packager}`)
    }

    options.packager = this.packager
    this.options = options;
  }

  call(methodName: string, args: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.uri.hostname,
        port: this.uri.port,
        path: this.uri.pathname,
        protocol: this.uri.protocol,
        headers: {
          'User-Agent': `PHP Yar Rpc-${PHP_YAR_VERSION}`,
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

      const id = mt_rand();

      protocolEncoder.writeRequest({
        id,
        packager: this.packager,
        methodName,
        args,
        timeout: 3000,
      });

      protocolDecoder.on('response', (res: YarResponsePacket) => {
        resolve(res.body.r);
      });

      req.end();
    })

  }

  setOpt(key: string, value: any) {
    this.options[key] = value;
  }
}

export {
  YarClient,
};
