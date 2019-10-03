const http = require('http')
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

  send(request) {
    const payload = YarRequest.pack(request)
    const header = protocol.render(request.id, this.data.host.user, this.data.host.pass, payload.lenth)
  }
  exec(request) {}
}

exports.CurlTransport = CurlTransport
