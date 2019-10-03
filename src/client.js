const http = require('http')
const { URL } = require('url')
const protocol = require('./protocol')

class YarClient {
  constructor(uri, options = {}) {
    const uriOptions = new URL(uri)

    this._uri = uriOptions
    this._protocol = uriOptions.protocol
    this._options = options
  }

  call(mehod, params, callback) {
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

    const payload = {
      i: Math.floor(Math.random() * 10e6),
      m: mehod,
      p: params
    }

    const packet = protocol.pack(payload.i, undefined, undefined, payload)

    const req = http.request(options, res => {
      let buf = Buffer.alloc(0)
      res.on('data', chunk => {
        buf = Buffer.concat([buf, chunk])
      })
      res.on('end', () => {
        if (!buf.length) return
        const res = protocol.unpack(buf)
        callback(res.payload.r)
      })
    })

    req.write(packet)

    req.end()
  }
}

exports.YarClient = YarClient
