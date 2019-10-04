const http = require('http')
const { URL } = require('url')
const { Packager } = require('./packagers/packager')
const protocol = require('./protocol')
const { HEADER_LEN, PACKAGER_NAME_LEN } = require('./const')

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

    const packager = this.packager
    const packagerNameBuf = Buffer.alloc(8)
    packagerNameBuf.write(this._options.packager, 0, PACKAGER_NAME_LEN, 'utf-8')
    const body = Buffer.from(packager.pack(payload))
    const packetLength = HEADER_LEN + PACKAGER_NAME_LEN + body.length
    const header = protocol.render(payload.i, undefined, undefined, packetLength)
    const packet = Buffer.concat([header, packagerNameBuf, body], packetLength)

    const req = http.request(options, function(res) {
      let resHeader

      res.on('readable', () => {
        if (!resHeader) {
          resHeader = res.read(HEADER_LEN)
        }
        if (!resHeader) return
        const parsedResHeader = protocol.parse(resHeader)
        const resBody = res.read(parsedResHeader.bodyLength)

        if (!resBody) return

        const resPayload = packager.unpack(resBody.slice(PACKAGER_NAME_LEN, resBody.length))
        callback(resPayload.r)
      })
    })

    req.write(packet)

    req.end()
  }
}

exports.YarClient = YarClient
