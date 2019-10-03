const { CurlTransport } = require('./curl.transport')
const { SocketTransport } = require('./socket.transport')

class Transport {
  constructor(type) {
    switch (type) {
      case 'curl':
        return new CurlTransport()
      case 'sock':
        return new SocketTransport()
      default:
        throw new Error('unsupported transport type')
    }
  }
}

exports.Transport = Transport
