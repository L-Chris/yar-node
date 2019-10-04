const http = require('http')
const { URL } = require('url')
const { Packager } = require('./packagers/packager')
const protocol = require('./protocol')

class YarClient {
  constructor(uri, options = {}) {
    const uriOptions = new URL(uri)

    this._uri = uriOptions
    this._protocol = uriOptions.protocol

    options.packager = options.packager || 'php'

    this._options = options

    this.packager = Packager.get(this._options.packager)
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
    const packagerNameBuf = Buffer.alloc(8)
    packagerNameBuf.write(this._options.packager, 0, 8, 'utf-8')
    const body = Buffer.from(this.packager.pack(payload))
    const packetLength = 82 + packagerNameBuf.length + body.length
    const header = protocol.render(payload.i, undefined, undefined, packetLength)
    const packet = Buffer.concat([header, packagerNameBuf, body], packetLength)

    const req = http.request(options, res => {
      let buf = Buffer.alloc(0)
      res.on('data', chunk => {
        buf = Buffer.concat([buf, chunk])
      })
      res.on('end', () => {
        if (!buf.length) return
        const reqBody = buf.slice(82 + packagerNameBuf.length, buf.length)
        const reqPayload = this.packager.unpack(reqBody)
        callback(reqPayload.r)
      })
    })

    req.write(packet)

    req.end()
  }
}

exports.YarClient = YarClient
