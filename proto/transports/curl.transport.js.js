const http = require('http')
const { URL } = require('url')
const { YarRequest } = require('../request')
const protocol = require('../protocol')

class CurlTransport {
  constructor() {
    this.data = {
      headers: {
        'User-Agent': `PHP Yar Rpc-0.0.1`,
        'Expect': '',
        'Content-Type': 'application/octet-stream'
      },
      host: {}
    }
  }

  open(uri, options) {
    const uriOptions = new URL(uri)
    this.data.protocol = uriOptions.protocol
    this.data.hostname = uriOptions.hostname
    this.data.path = uriOptions.pathname
    this.data.port = uriOptions.port
    this.data.method = 'POST'

    if (options.persistent) {
      this.data.persistent = 1
    }

    if (this.data.persistent) {
      this.data.headers['Connection'] = 'Keep-Alive'
      this.data.headers['Keep-Alive'] = '300'
    } else {
      this.data.headers['Connection'] = 'close'
    }
  }

  send(request) {
    const payload = YarRequest.pack(request)
    const header = protocol.render(request.id, this.data.host.user, this.data.host.pass, payload.lenth)
    this.data.postfield = payload
    return header
  }

  exec(request, packet) {
    const req = http.request(this.data, res => {
      const buf = new Buffer(0)
      res.on('data', chunk => {
        buf.concat(chunk)
      })

      res.on('end', () => {
      })
    })

    req.write(packet)

    req.end()
  }
}

exports.CurlTransport = CurlTransport
