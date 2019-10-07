const http = require('http')
const { ProtocolDecoder } = require('./protocol/decoder')
const { ProtocolEncoder } = require('./protocol/encoder')

class YarServer {
  constructor(methods) {
    this.methods = methods
    this.port = 3000
  }

  handle() {
    const server = http.createServer((req, res) => {
      const protocolEncoder = new ProtocolEncoder()
      const protocolDecoder = new ProtocolDecoder()

      req.pipe(protocolDecoder)

      protocolEncoder.pipe(res)

      protocolDecoder.on('request', obj => {
        const {
          m: method,
          p: params
        } = obj.data

        const result = this.methods[method](params)

        protocolEncoder.writeResponse({
          id: Math.floor(Math.random() * 10e6),
          packager: obj.packagerName,
          result
        })

        res.end()
      })
    })

    server.on('listening', () => {
      console.log(`listening on http://127.0.0.1:${this.port}`)
    })

    server.listen(this.port)

    this.server = server
  }
}

exports.YarServer = YarServer
