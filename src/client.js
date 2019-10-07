const http = require('http')
const { URL } = require('url')
const { Packager } = require('./packagers/packager')
const { ProtocolDecoder } = require('./decoder')
const { ProtocolEncoder } = require('./encoder')
const { nextId } = require('./utils')

class YarClient {
  constructor(uri, options = {}) {
    const uriOptions = new URL(uri)

    this._uri = uriOptions
    this._protocol = uriOptions.protocol
    options.packager = options.packager || 'php'
    this._options = options
    this.packager = Packager.get(this._options.packager)
  }

  call(methodName, args, callback) {
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

    protocolEncoder.writeRequest(id, {
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

exports.YarClient = YarClient
