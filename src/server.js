const http = require('http')
const { ProtocolDecoder } = require('./protocol/decoder')
const { ProtocolEncoder } = require('./protocol/encoder')

class YarServer {
  constructor(port, methods, options) {
    this.port = port
    this.methods = methods
    this.options = options
    this.init()
  }

  init() {
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

    this.server = server

    this.server.on('listening', () => {
      console.log(`listening on http://127.0.0.1:${this.port}`)
    })

    this.server.listen(this.port)
  }
}

exports.YarServer = YarServer
