const http = require('http')
const { URL } = require('url')

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

    const data = {
      i: Math.floor(Math.random() * 10e6),
      m: mehod,
      p: params
    }

    const req = http.request(options, res => {
      const buf = new Buffer()
      res.on('data', chunk => chunk)
      res.on('end', () => {
        const res = unpack(buf)
        callback(res)
      })
    })

    req.write(data)

    req.end()
  }
}

exports.YarClient = YarClient
