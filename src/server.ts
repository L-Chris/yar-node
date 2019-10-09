import * as http from 'http';
import { ProtocolDecoder } from './decoder';
import { ProtocolEncoder } from './encoder';

interface YarServerOptions {
  port?: number;
}

interface YarServerApi {
  [key: string]: () => object;
}

class YarServer {
  methods: object;
  port: number;
  server: http.Server;
  constructor(methods: YarServerApi, options: YarServerOptions = {}) {
    this.methods = methods;
    this.port = options.port || 3000;

    this.init();
  }

  init() {
    const server = http.createServer((req, res) => {
      const protocolEncoder = new ProtocolEncoder();
      const protocolDecoder = new ProtocolDecoder();

      req.pipe(protocolDecoder);

      protocolEncoder.pipe(res);

      protocolDecoder.on('request', async (obj) => {
        const {
          m: methodName,
          p: args,
        } = obj.body;

        const data = await this.methods[methodName](args);
        protocolEncoder.writeResponse(obj, {
          packager: obj.packager,
          data,
        });

        res.end();
      });
    });

    this.server = server;
  }

  handle() {
    this.server.listen(this.port);
  }
}

export {
  YarServer,
};
