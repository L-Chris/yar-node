import * as http from 'http'
import { URL } from 'url'
import { getPackager } from './packagers'
import { ProtocolDecoder } from './decoder'
import { ProtocolEncoder } from './encoder'
import { nextId } from './utils'

export interface YarClientOptions {
  packager?: string
}

class YarClient {
  _uri: URL;
  _protocol: string;
  _options: any;
  packager: PackagerInterface;
  constructor(uri: string, options: YarClientOptions = {}) {
    const uriOptions = new URL(uri)

    this._uri = uriOptions
    this._protocol = uriOptions.protocol
    options.packager = options.packager || 'php'
    this._options = options
    this.packager = getPackager(this._options.packager)
  }

  call(methodName: string, args: any, callback: Function) {
    const options = {
      hostname: this._uri.hostname,
      port: this._uri.port,
      path: this._uri.pathname,
      protocol: this._uri.protocol,
      headers: {
        'User-Agent': `PHP Yar Rpc-0.0.1`,
        'Content-Type': 'application/octet-stream',
        'Transfer-Encoding': 'chunked',
        'Connection': 'Keep-Alive',
        'Keep-Alive': '300'
      }
    }

    const protocolEncoder = new ProtocolEncoder()
    const protocolDecoder = new ProtocolDecoder()

    const req = http.request(options, function(res) {
      res.pipe(protocolDecoder)
    })

    protocolEncoder.pipe(req)

    const id = nextId()

    protocolEncoder.writeRequest({
      id,
      packager: this._options.packager,
      methodName,
      args,
      timeout: 3000
    })

    protocolDecoder.on('response', res => {
      callback(res.body.r)
    })

    req.end()
  }

  setOpt() {}
}

export {
  YarClient
}
